import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  type User,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../config/firebase';
import type { StudentProfile, TeacherProfile, UserProfile } from '../utils/studentRecords';
import { authStore } from '../utils/authStore';
import { firebaseService } from './firebaseService';

export interface FirebaseAuthResult {
  success: boolean;
  message: string;
  code?: string;
  hint?: string;
  profile?: UserProfile;
}

/**
 * Format pesan kesalahan Firebase Auth menjadi bahasa Indonesia yang informatif dan solutif
 */
function parseAuthErrorMessage(errorCode: string, defaultMsg: string): { message: string; code: string; hint?: string } {
  let message = defaultMsg || 'Terjadi kendala saat menghubungkan akun Firebase.';
  let hint: string | undefined = undefined;

  switch (errorCode) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      message = 'Email atau kata sandi tidak cocok. Silakan periksa kembali.';
      hint = 'Jika belum punya akun, silakan beralih ke tab "Daftar Akun Baru".';
      break;
    case 'auth/email-already-in-use':
      message = 'Email ini sudah terdaftar di Firebase.';
      hint = 'Silakan beralih ke tab "Masuk (Login)" menggunakan email ini.';
      break;
    case 'auth/weak-password':
      message = 'Kata sandi terlalu pendek.';
      hint = 'Firebase mewajibkan kata sandi minimal 6 karakter.';
      break;
    case 'auth/invalid-email':
      message = 'Format email tidak valid.';
      hint = 'Contoh format yang benar: nama@gmail.com atau siswa@sekolah.sch.id.';
      break;
    case 'auth/popup-closed-by-user':
      message = 'Jendela popup Google ditutup sebelum login selesai.';
      hint = 'Klik tombol Google lagi dan pilih akun Google Anda.';
      break;
    case 'auth/popup-blocked':
      message = 'Jendela popup Google diblokir oleh browser.';
      hint = 'Izinkan pop-up (Allow pop-ups) pada bilah alamat browser Anda untuk web ini.';
      break;
    case 'auth/cancelled-popup-request':
      message = 'Permintaan masuk Google dibatalkan karena ada popup lain yang sedang diproses.';
      break;
    case 'auth/operation-not-allowed':
    case 'auth/configuration-not-found':
      message = 'Penyedia login belum diaktifkan di Firebase Console.';
      hint = 'Buka Firebase Console > Authentication > tab "Sign-in method" > Aktifkan "Email/Password" dan "Google".';
      break;
    case 'auth/unauthorized-domain':
      message = 'Domain web ini belum diizinkan oleh Firebase.';
      hint = 'Buka Firebase Console > Authentication > tab "Settings" > "Authorized domains" > Tambahkan "localhost".';
      break;
    case 'auth/network-request-failed':
      message = 'Koneksi jaringan ke server Firebase gagal.';
      hint = 'Periksa koneksi internet Anda atau pastikan firewall tidak memblokir koneksi ke firebaseapp.com.';
      break;
    case 'auth/api-key-not-valid':
    case 'auth/invalid-api-key':
      message = 'Kunci API Firebase (API Key) tidak valid.';
      hint = 'Periksa nilai VITE_FIREBASE_API_KEY di file .env.local Anda.';
      break;
    default:
      if (errorCode) {
        message = `Kendala Firebase: ${defaultMsg}`;
        hint = `Kode kesalahan: ${errorCode}. Silakan periksa pengaturan Authentication di Firebase Console.`;
      }
      break;
  }

  return { message, code: errorCode, hint };
}

/**
 * Layanan Otentikasi ChemVerse berbasis Firebase Auth
 * Firebase Auth sebagai Sistem Otentikasi UTAMA (Main Authentication)
 */
export const firebaseAuthService = {
  /**
   * Masuk atau Daftar Menggunakan Akun Google (1-Click Google Sign-In)
   */
  async loginWithGoogle(
    role: 'student' | 'teacher',
    defaultClass: string = 'Kelas 12 IPA 1'
  ): Promise<FirebaseAuthResult> {
    if (!auth || !isFirebaseConfigured) {
      return {
        success: false,
        message: 'Firebase belum terhubung. Pastikan kredensial di file .env.local sudah benar.',
        code: 'auth/not-configured',
        hint: 'Periksa file .env.local Anda di folder proyek.',
      };
    }

    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      provider.setCustomParameters({ prompt: 'select_account' });

      const credential = await signInWithPopup(auth, provider);
      const user: User = credential.user;

      const displayName = user.displayName || user.email?.split('@')[0] || 'Pengguna ChemVerse';
      const email = user.email || '';
      const photoURL = user.photoURL || undefined;

      // 1. Cek apakah pengguna sudah memiliki profil tersimpan di Cloud Firestore
      let userProfile = await firebaseService.getUserProfile(user.uid);

      if (!userProfile) {
        // Buat profil baru di Cloud Firestore
        if (role === 'teacher') {
          userProfile = {
            role: 'teacher',
            name: displayName,
            title: 'Guru Kimia SMA Kelas 12',
            email,
            avatar: photoURL,
          };
        } else {
          userProfile = {
            role: 'student',
            name: displayName,
            className: defaultClass,
            email,
            avatar: photoURL,
          };
        }
        await firebaseService.saveUserProfile(user.uid, userProfile);
      }

      // 2. Simpan juga ke cache lokal agar instan saat offline
      authStore.saveGoogleAccount({
        role: userProfile.role,
        name: userProfile.name,
        email,
        avatar: photoURL,
        className: userProfile.role === 'student' ? userProfile.className : undefined,
        title: userProfile.role === 'teacher' ? userProfile.title : undefined,
      });

      // 3. Jika peran adalah siswa, rekam ke daftar pemantauan guru (chemverse_students)
      if (userProfile.role === 'student') {
        await firebaseService.saveStudentToCloud({
          id: `std-${user.uid.slice(0, 8)}`,
          name: userProfile.name,
          className: userProfile.className,
          loginTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
          score: 0,
          maxScore: 4,
          status: 'Sedang Belajar',
          completedQuestionsCount: 0,
        });

        return {
          success: true,
          message: `Berhasil masuk dengan akun Google: ${userProfile.name}`,
          profile: userProfile,
        };
      } else {
        return {
          success: true,
          message: `Selamat datang di Panel Guru, ${userProfile.name}!`,
          profile: userProfile,
        };
      }
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      console.warn('⚠️ Gagal login Google:', err);
      const errInfo = parseAuthErrorMessage(err.code || '', err.message || 'Gagal masuk dengan Google.');
      return {
        success: false,
        message: errInfo.message,
        code: errInfo.code,
        hint: errInfo.hint,
      };
    }
  },

  /**
   * Daftar Akun Baru Menggunakan Email dan Password ke Firebase Authentication
   */
  async registerWithEmail(params: {
    email: string;
    password: string;
    name: string;
    role: 'student' | 'teacher';
    className?: string;
    title?: string;
  }): Promise<FirebaseAuthResult> {
    const { email, password, name, role, className, title } = params;

    // Validasi dasar
    if (!email || !email.includes('@')) {
      return {
        success: false,
        message: 'Format email tidak valid. Masukkan email aktif Anda.',
        code: 'auth/invalid-email',
        hint: 'Contoh: siswa@gmail.com atau nama@sekolah.sch.id',
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        message: 'Kata sandi minimal 6 karakter sesuai standar keamanan Firebase.',
        code: 'auth/weak-password',
        hint: 'Gunakan minimal 6 karakter kombinasi huruf dan angka.',
      };
    }

    // Jika Firebase terkonfigurasi, buat akun di Firebase Authentication
    if (auth && isFirebaseConfigured) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (cred.user) {
          await updateProfile(cred.user, { displayName: name });
        }

        const profile: UserProfile =
          role === 'teacher'
            ? {
                role: 'teacher',
                name,
                title: title || 'Guru Kimia SMA Kelas 12',
                email,
              }
            : {
                role: 'student',
                name,
                className: className || 'Kelas 12 IPA 1',
                email,
              };

        // Simpan profil lengkap ke Cloud Firestore (chemverse_users)
        await firebaseService.saveUserProfile(cred.user.uid, profile);

        // Jika siswa, rekam juga ke pemantauan guru (chemverse_students)
        if (role === 'student') {
          await firebaseService.saveStudentToCloud({
            id: `std-${cred.user.uid.slice(0, 8)}`,
            name,
            className: className || 'Kelas 12 IPA 1',
            loginTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
            score: 0,
            maxScore: 4,
            status: 'Sedang Belajar',
            completedQuestionsCount: 0,
          });
        }

        // Simpan juga ke cache lokal
        authStore.register({
          role,
          name,
          username: email.split('@')[0],
          email,
          password,
          className,
          title,
        });

        return {
          success: true,
          message: 'Pendaftaran akun Firebase berhasil! Selamat bergabung di ChemVerse.',
          profile,
        };
      } catch (error: unknown) {
        const err = error as { code?: string; message?: string };
        console.warn('⚠️ Gagal register email Firebase:', err);
        const errInfo = parseAuthErrorMessage(err.code || '', err.message || 'Pendaftaran gagal.');
        return {
          success: false,
          message: errInfo.message,
          code: errInfo.code,
          hint: errInfo.hint,
        };
      }
    }

    // Fallback lokal jika Firebase belum diatur
    const localRes = authStore.register({
      role,
      name,
      username: email.split('@')[0],
      email,
      password,
      className,
      title,
    });

    if (!localRes.success) {
      return { success: false, message: localRes.message };
    }

    const localProfile: UserProfile =
      role === 'student'
        ? {
            role: 'student',
            name,
            className: className || 'Kelas 12 IPA 1',
            email,
          }
        : {
            role: 'teacher',
            name,
            title: title || 'Guru Kimia SMA Kelas 12',
            email,
          };

    return {
      success: true,
      message: 'Pendaftaran lokal berhasil!',
      profile: localProfile,
    };
  },

  /**
   * Masuk Menggunakan Email dan Kata Sandi ke Firebase Authentication
   */
  async loginWithEmail(
    email: string,
    password: string,
    role: 'student' | 'teacher'
  ): Promise<FirebaseAuthResult> {
    // 1. Coba login melalui Firebase Auth jika terhubung
    if (auth && isFirebaseConfigured) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const user = cred.user;

        // Ambil profil lengkap dari Cloud Firestore
        let profile = await firebaseService.getUserProfile(user.uid);

        if (!profile) {
          // Jika belum tersimpan di Firestore, buat profil baru dari data akun
          const displayName = user.displayName || email.split('@')[0];
          profile =
            role === 'teacher'
              ? {
                  role: 'teacher',
                  name: displayName,
                  title: 'Guru Kimia SMA Kelas 12',
                  email: user.email || email,
                  avatar: user.photoURL || undefined,
                }
              : {
                  role: 'student',
                  name: displayName,
                  className: 'Kelas 12 IPA 1',
                  email: user.email || email,
                  avatar: user.photoURL || undefined,
                };
          await firebaseService.saveUserProfile(user.uid, profile);
        }

        // Perbarui juga data di cache lokal
        authStore.saveGoogleAccount({
          role: profile.role,
          name: profile.name,
          email: user.email || email,
          avatar: profile.avatar,
          className: profile.role === 'student' ? profile.className : undefined,
          title: profile.role === 'teacher' ? profile.title : undefined,
        });

        return {
          success: true,
          message: `Berhasil masuk sebagai ${profile.name}`,
          profile,
        };
      } catch (error: unknown) {
        const err = error as { code?: string; message?: string };
        const errInfo = parseAuthErrorMessage(err.code || '', err.message || 'Gagal masuk.');
        return {
          success: false,
          message: errInfo.message,
          code: errInfo.code,
          hint: errInfo.hint,
        };
      }
    }

    // 2. Fallback mode offline/lokal jika Firebase belum diatur di .env.local
    const res = authStore.login(email, password, role);
    if (!res.success || !res.account) {
      return { success: false, message: res.message };
    }

    const fallbackProfile: UserProfile =
      res.account.role === 'student'
        ? {
            role: 'student',
            name: res.account.name,
            className: res.account.className || 'Kelas 12 IPA 1',
            email: res.account.email,
          }
        : {
            role: 'teacher',
            name: res.account.name,
            title: res.account.title || 'Guru Kimia SMA Kelas 12',
            email: res.account.email,
          };

    return {
      success: true,
      message: 'Berhasil masuk!',
      profile: fallbackProfile,
    };
  },

  /**
   * Logout dari Firebase
   */
  async logout(): Promise<void> {
    if (auth && isFirebaseConfigured) {
      try {
        await signOut(auth);
      } catch (err) {
        console.warn('Gagal sign out Firebase:', err);
      }
    }
  },
};
