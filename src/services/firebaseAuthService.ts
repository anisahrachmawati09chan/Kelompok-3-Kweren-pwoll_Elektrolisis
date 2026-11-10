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
  profile?: UserProfile;
}

/**
 * Format pesan kesalahan Firebase Auth menjadi bahasa Indonesia yang ramah
 */
function parseAuthErrorMessage(errorCode: string, defaultMsg: string): string {
  switch (errorCode) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email atau kata sandi salah. Silakan periksa kembali akun Anda.';
    case 'auth/email-already-in-use':
      return 'Email ini sudah terdaftar. Silakan gunakan tab "Masuk" untuk masuk.';
    case 'auth/weak-password':
      return 'Kata sandi terlalu pendek. Minimal 6 karakter untuk akun Firebase.';
    case 'auth/invalid-email':
      return 'Format email tidak valid (contoh: siswa@gmail.com).';
    case 'auth/popup-closed-by-user':
      return 'Jendela masuk Google ditutup sebelum proses selesai.';
    case 'auth/cancelled-popup-request':
      return 'Permintaan masuk Google dibatalkan.';
    case 'auth/operation-not-allowed':
      return 'Penyedia login ini belum diaktifkan di Firebase Console. Buka Firebase Console > Authentication > Sign-in method, lalu aktifkan Google atau Email/Password.';
    case 'auth/unauthorized-domain':
      return 'Domain web belum diizinkan. Tambahkan "localhost" pada Firebase Console > Authentication > Settings > Authorized domains.';
    default:
      return defaultMsg || 'Terjadi kendala saat menghubungkan akun.';
  }
}

/**
 * Layanan Otentikasi ChemVerse berbasis Firebase Auth
 * Mendukung Login Google, Email/Password, dan Fallback Lokal
 */
export const firebaseAuthService = {
  /**
   * Masuk atau Daftar Menggunakan Akun Google
   */
  async loginWithGoogle(
    role: 'student' | 'teacher',
    defaultClass: string = 'Kelas 12 IPA 1'
  ): Promise<FirebaseAuthResult> {
    if (!auth || !isFirebaseConfigured) {
      return {
        success: false,
        message:
          'Firebase belum terhubung. Pastikan Anda telah mengisi kredensial pada file .env.local.',
      };
    }

    try {
      const provider = new GoogleAuthProvider();
      // Minta akses profil & email
      provider.addScope('profile');
      provider.addScope('email');
      provider.setCustomParameters({ prompt: 'select_account' });

      const credential = await signInWithPopup(auth, provider);
      const user: User = credential.user;

      const displayName = user.displayName || user.email?.split('@')[0] || 'Pengguna ChemVerse';
      const email = user.email || '';
      const photoURL = user.photoURL || undefined;

      // Simpan data akun ke penyimpanan lokal agar cepat dimuat ulang
      authStore.saveGoogleAccount({
        role,
        name: displayName,
        email,
        avatar: photoURL,
        className: role === 'student' ? defaultClass : undefined,
        title: role === 'teacher' ? 'Guru Kimia SMA Kelas 12' : undefined,
      });

      if (role === 'student') {
        const studentProfile: StudentProfile = {
          role: 'student',
          name: displayName,
          className: defaultClass,
          email,
          avatar: photoURL,
        };

        // Rekam data siswa ke Cloud Firestore jika terhubung
        firebaseService.saveStudentToCloud({
          id: `std-google-${user.uid.slice(0, 8)}`,
          name: displayName,
          className: defaultClass,
          loginTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
          score: 0,
          maxScore: 4,
          status: 'Sedang Belajar',
          completedQuestionsCount: 0,
        });

        return {
          success: true,
          message: `Berhasil masuk dengan akun Google: ${displayName}`,
          profile: studentProfile,
        };
      } else {
        const teacherProfile: TeacherProfile = {
          role: 'teacher',
          name: displayName,
          title: 'Guru Kimia SMA Kelas 12',
          email,
          avatar: photoURL,
        };

        return {
          success: true,
          message: `Selamat datang di Panel Guru, ${displayName}!`,
          profile: teacherProfile,
        };
      }
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      console.warn('⚠️ Gagal login Google:', err);
      const friendlyMsg = parseAuthErrorMessage(
        err.code || '',
        err.message || 'Gagal masuk dengan Google.'
      );
      return {
        success: false,
        message: friendlyMsg,
      };
    }
  },

  /**
   * Daftar Akun Baru Menggunakan Email dan Password
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

    // Jika Firebase terkonfigurasi, daftarkan ke Firebase Authentication
    if (auth && isFirebaseConfigured) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (cred.user) {
          await updateProfile(cred.user, { displayName: name });
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

        if (role === 'student') {
          const studentProfile: StudentProfile = {
            role: 'student',
            name,
            className: className || 'Kelas 12 IPA 1',
            email,
          };
          return {
            success: true,
            message: 'Pendaftaran akun Firebase berhasil! Selamat bergabung di ChemVerse.',
            profile: studentProfile,
          };
        } else {
          const teacherProfile: TeacherProfile = {
            role: 'teacher',
            name,
            title: title || 'Guru Kimia SMA Kelas 12',
            email,
          };
          return {
            success: true,
            message: 'Pendaftaran akun Guru berhasil!',
            profile: teacherProfile,
          };
        }
      } catch (error: unknown) {
        const err = error as { code?: string; message?: string };
        console.warn('⚠️ Gagal register email Firebase:', err);
        return {
          success: false,
          message: parseAuthErrorMessage(err.code || '', err.message || 'Pendaftaran gagal.'),
        };
      }
    }

    // Fallback: Daftarkan ke sistem penyimpanan lokal
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

    if (role === 'student') {
      return {
        success: true,
        message: 'Pendaftaran lokal berhasil!',
        profile: {
          role: 'student',
          name,
          className: className || 'Kelas 12 IPA 1',
          email,
        },
      };
    } else {
      return {
        success: true,
        message: 'Pendaftaran guru lokal berhasil!',
        profile: {
          role: 'teacher',
          name,
          title: title || 'Guru Kimia SMA Kelas 12',
          email,
        },
      };
    }
  },

  /**
   * Masuk Menggunakan Email dan Kata Sandi
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
        const displayName = user.displayName || email.split('@')[0];

        // Cari atau perbarui di authStore lokal
        const localAccounts = authStore.getAccounts();
        const found = localAccounts.find(
          (a) => a.role === role && (a.email?.toLowerCase() === email.toLowerCase() || a.name === displayName)
        );

        if (role === 'student') {
          const profile: StudentProfile = {
            role: 'student',
            name: found?.name || displayName,
            className: found?.className || 'Kelas 12 IPA 1',
            email: user.email || email,
            avatar: user.photoURL || undefined,
          };
          return {
            success: true,
            message: `Berhasil masuk sebagai ${profile.name}`,
            profile,
          };
        } else {
          const profile: TeacherProfile = {
            role: 'teacher',
            name: found?.name || displayName,
            title: found?.title || 'Guru Kimia SMA Kelas 12',
            email: user.email || email,
            avatar: user.photoURL || undefined,
          };
          return {
            success: true,
            message: `Selamat datang, ${profile.name}`,
            profile,
          };
        }
      } catch (error: unknown) {
        const err = error as { code?: string; message?: string };
        // Jika error adalah unauthorized-domain atau operation-not-allowed, coba fallback ke authStore
        if (
          err.code === 'auth/operation-not-allowed' ||
          err.code === 'auth/unauthorized-domain' ||
          err.code === 'auth/network-request-failed'
        ) {
          console.warn('Firebase Auth belum aktif, mencoba kredensial lokal...');
          const localRes = authStore.login(email, password, role);
          if (localRes.success && localRes.account) {
            return {
              success: true,
              message: 'Berhasil masuk melalui mode penyimpanan lokal.',
              profile:
                localRes.account.role === 'student'
                  ? {
                    role: 'student',
                    name: localRes.account.name,
                    className: localRes.account.className || 'Kelas 12 IPA 1',
                    email: localRes.account.email,
                  }
                  : {
                    role: 'teacher',
                    name: localRes.account.name,
                    title: localRes.account.title || 'Guru Kimia SMA Kelas 12',
                    email: localRes.account.email,
                  },
            };
          }
        }
        return {
          success: false,
          message: parseAuthErrorMessage(err.code || '', err.message || 'Gagal masuk.'),
        };
      }
    }

    // 2. Fallback mode offline/lokal jika Firebase belum diatur di .env.local
    const res = authStore.login(email, password, role);
    if (!res.success || !res.account) {
      return { success: false, message: res.message };
    }

    if (res.account.role === 'student') {
      return {
        success: true,
        message: 'Berhasil masuk!',
        profile: {
          role: 'student',
          name: res.account.name,
          className: res.account.className || 'Kelas 12 IPA 1',
          email: res.account.email,
        },
      };
    } else {
      return {
        success: true,
        message: 'Berhasil masuk!',
        profile: {
          role: 'teacher',
          name: res.account.name,
          title: res.account.title || 'Guru Kimia SMA Kelas 12',
          email: res.account.email,
        },
      };
    }
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
