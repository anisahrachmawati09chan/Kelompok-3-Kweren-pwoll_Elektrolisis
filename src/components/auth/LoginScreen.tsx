import React, { useState } from 'react';
import {
  FlaskConical,
  User,
  School,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  CheckCircle2,
  Mail,
  Loader2,
} from 'lucide-react';
import type { UserProfile, StudentProfile, TeacherProfile } from '../../utils/studentRecords';
import { authStore } from '../../utils/authStore';
import { firebaseAuthService } from '../../services/firebaseAuthService';
import { isFirebaseConfigured } from '../../config/firebase';

interface LoginScreenProps {
  onLogin: (profile: UserProfile) => void;
  defaultClass?: string;
}

/**
 * LoginScreen: Halaman Otentikasi ChemVerse
 * Mendukung:
 * 1. Masuk & Daftar dengan Akun Google (Firebase Auth GoogleAuthProvider)
 * 2. Masuk & Daftar dengan Email dan Kata Sandi (Firebase Auth + Fallback Lokal)
 * 3. Masuk Cepat Demo (Siswa & Guru)
 * 4. Pilihan Peran Akun Siswa & Akun Guru
 */
export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  defaultClass = 'Kelas 12 IPA 1',
}) => {
  // Mode: 'login' (Masuk) atau 'register' (Daftar Akun Baru)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Peran: 'student' (Siswa) atau 'teacher' (Guru)
  const [role, setRole] = useState<'student' | 'teacher'>('student');

  // Input Umum (Login & Register)
  const [identifier, setIdentifier] = useState<string>(''); // Email, Nama, atau Username untuk login
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Input Khusus Pendaftaran Siswa
  const [regFullName, setRegFullName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regUsername, setRegUsername] = useState<string>('');
  const [regClassName, setRegClassName] = useState<string>(defaultClass);
  const [regCustomClass, setRegCustomClass] = useState<string>('');

  // Input Khusus Pendaftaran Guru
  const [regTeacherName, setRegTeacherName] = useState<string>('');
  const [regTeacherEmail, setRegTeacherEmail] = useState<string>('');
  const [regTeacherUsername, setRegTeacherUsername] = useState<string>('');
  const [regTeacherTitle, setRegTeacherTitle] = useState<string>('Guru Kimia SMA Kelas 12');

  // Loading States
  const [isLoadingGoogle, setIsLoadingGoogle] = useState<boolean>(false);
  const [isLoadingEmail, setIsLoadingEmail] = useState<boolean>(false);

  // Pesan Status
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Reset form error saat berganti tab
  const handleSwitchMode = (newMode: 'login' | 'register') => {
    setAuthMode(newMode);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleSwitchRole = (newRole: 'student' | 'teacher') => {
    setRole(newRole);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

    /**
     * Handler Masuk dengan Akun Google
     */
    const handleGoogleSignIn = async () => {
      setErrorMsg(null);
      setSuccessMsg(null);
      setIsLoadingGoogle(true);

      try {
        const targetClass = regClassName === 'Lainnya' ? regCustomClass || defaultClass : regClassName;
        const res = await firebaseAuthService.loginWithGoogle(role, targetClass);

        setIsLoadingGoogle(false);

        if (res.success && res.profile) {
          setSuccessMsg(res.message);
          setTimeout(() => {
            onLogin(res.profile!);
          }, 500);
        } else {
          setErrorMsg(res.message);
        }
      } catch {
        setIsLoadingGoogle(false);
        setErrorMsg('Gagal menghubungkan ke akun Google. Silakan periksa kembali konfigurasi Firebase Anda.');
      }
    };

    /**
     * Submit Handler (Email & Password / Form Akun)
     */
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMsg(null);
      setSuccessMsg(null);

      // ==========================================
      // 1. PROSES MASUK (LOGIN)
      // ==========================================
      if (authMode === 'login') {
        const cleanId = identifier.trim();
        const cleanPass = password.trim();

        if (!cleanId) {
          setErrorMsg(
            `Silakan masukkan email, nama, atau username ${role === 'student' ? 'siswa' : 'guru'}.`
          );
          return;
        }

        if (!cleanPass) {
          setErrorMsg('Silakan masukkan kata sandi Anda.');
          return;
        }

        setIsLoadingEmail(true);

        // Coba masuk via Firebase Auth jika menggunakan email atau Firebase aktif
        if (cleanId.includes('@') || isFirebaseConfigured) {
          const fbRes = await firebaseAuthService.loginWithEmail(cleanId, cleanPass, role);
          if (fbRes.success && fbRes.profile) {
            setIsLoadingEmail(false);
            setSuccessMsg(fbRes.message);
            setTimeout(() => {
              onLogin(fbRes.profile!);
            }, 400);
            return;
          } else if (cleanId.includes('@')) {
            // Jika memasukkan format email dan gagal, tampilkan pesan Firebase
            setIsLoadingEmail(false);
            setErrorMsg(fbRes.message);
            return;
          }
        }

        // Coba masuk via database lokal authStore
        const res = authStore.login(cleanId, cleanPass, role);
        setIsLoadingEmail(false);

        if (!res.success || !res.account) {
          setErrorMsg(res.message);
          return;
        }

        // Login lokal berhasil
        if (res.account.role === 'student') {
          const studentProfile: StudentProfile = {
            role: 'student',
            name: res.account.name,
            className: res.account.className || 'Kelas 12 IPA 1',
            email: res.account.email,
          };
          onLogin(studentProfile);
        } else {
          const teacherProfile: TeacherProfile = {
            role: 'teacher',
            name: res.account.name,
            title: res.account.title || 'Guru Kimia SMA Kelas 12',
            email: res.account.email,
          };
          onLogin(teacherProfile);
        }
        return;
      }

      // ==========================================
      // 2. PROSES DAFTAR (REGISTER)
      // ==========================================
      if (authMode === 'register') {
        if (role === 'student') {
          const cleanName = regFullName.trim();
          const cleanEmail = regEmail.trim();
          const cleanUname = (regUsername.trim() || cleanName.toLowerCase().replace(/\s+/g, '')).toLowerCase();
          const cleanClass = (regClassName === 'Lainnya' ? regCustomClass : regClassName).trim();

          if (!cleanName) {
            setErrorMsg('Nama lengkap siswa wajib diisi.');
            return;
          }

          if (!cleanClass) {
            setErrorMsg('Silakan pilih atau tuliskan kelas Anda.');
            return;
          }

          if (password.length < 3) {
            setErrorMsg('Kata sandi minimal 3 karakter (minimal 6 jika mendaftar akun Firebase).');
            return;
          }

          if (password !== confirmPassword) {
            setErrorMsg('Konfirmasi kata sandi tidak cocok. Silakan periksa kembali.');
            return;
          }

          setIsLoadingEmail(true);

          // Jika mengisi email, prioritaskan pendaftaran Firebase Auth
          if (cleanEmail) {
            const fbRes = await firebaseAuthService.registerWithEmail({
              email: cleanEmail,
              password,
              name: cleanName,
              role: 'student',
              className: cleanClass,
            });

            setIsLoadingEmail(false);

            if (!fbRes.success) {
              setErrorMsg(fbRes.message);
              return;
            }

            setSuccessMsg(fbRes.message);
            setTimeout(() => {
              if (fbRes.profile) onLogin(fbRes.profile);
            }, 600);
            return;
          }

          // Pendaftaran akun lokal tanpa email
          const res = authStore.register({
            role: 'student',
            name: cleanName,
            username: cleanUname,
            password: password,
            className: cleanClass,
          });

          setIsLoadingEmail(false);

          if (!res.success) {
            setErrorMsg(res.message);
            return;
          }

          setSuccessMsg('Akun siswa berhasil dibuat! Sedang masuk...');
          setTimeout(() => {
            onLogin({
              role: 'student',
              name: cleanName,
              className: cleanClass,
            });
        }, 600);
      } else {
        // Pendaftaran Guru
        const cleanTeacherName = regTeacherName.trim();
        const cleanTeacherEmail = regTeacherEmail.trim();
        const cleanTeacherUname = (
          regTeacherUsername.trim() || cleanTeacherName.toLowerCase().replace(/\s+/g, '')
        ).toLowerCase();
        const cleanTitle = regTeacherTitle.trim() || 'Guru Kimia SMA Kelas 12';

        if (!cleanTeacherName) {
          setErrorMsg('Nama lengkap guru wajib diisi.');
          return;
        }

        if (password.length < 3) {
          setErrorMsg('Kata sandi minimal 3 karakter (minimal 6 jika mendaftar akun Firebase).');
          return;
        }

        if (password !== confirmPassword) {
          setErrorMsg('Konfirmasi kata sandi tidak cocok. Silakan periksa kembali.');
          return;
        }

        setIsLoadingEmail(true);

        // Jika guru mengisi email, daftarkan ke Firebase Auth
        if (cleanTeacherEmail) {
          const fbRes = await firebaseAuthService.registerWithEmail({
            email: cleanTeacherEmail,
            password,
            name: cleanTeacherName,
            role: 'teacher',
            title: cleanTitle,
          });

          setIsLoadingEmail(false);

          if (!fbRes.success) {
            setErrorMsg(fbRes.message);
            return;
          }

          setSuccessMsg(fbRes.message);
          setTimeout(() => {
            if (fbRes.profile) onLogin(fbRes.profile);
          }, 600);
          return;
        }

        // Pendaftaran lokal guru
        const res = authStore.register({
          role: 'teacher',
          name: cleanTeacherName,
          username: cleanTeacherUname,
          password: password,
          title: cleanTitle,
        });

        setIsLoadingEmail(false);

        if (!res.success) {
          setErrorMsg(res.message);
          return;
        }

        setSuccessMsg('Akun guru berhasil dibuat! Sedang membuka Dashboard Guru...');
        setTimeout(() => {
          onLogin({
            role: 'teacher',
            name: cleanTeacherName,
            title: cleanTitle,
          });
      }, 600);
    }
  }
};

// Quick Demo Buttons
const handleQuickDemoStudent = () => {
  setErrorMsg(null);
  onLogin({
    role: 'student',
    name: 'Elsa Rasengraffe',
    className: 'Kelas 12 IPA 1',
    email: 'elsa@chemverse.edu',
  });
};

const handleQuickDemoTeacher = () => {
  setErrorMsg(null);
  onLogin({
    role: 'teacher',
    name: 'Ibu Rahmawati, M.Pd.',
    title: 'Guru Kimia SMA Kelas 12',
    email: 'rahmawati@guru.sma.belajar.id',
  });
};

return (
  <div className="login-screen-wrapper">
    <div className="login-card">
      {/* Header Kartu Otentikasi */}
      <div className="login-header">
        <div className="login-icon-badge">
          <FlaskConical size={28} />
        </div>
        <span className="login-curriculum-tag">Fase F Kurikulum Merdeka</span>
        <h1 className="login-title">
          {authMode === 'login' ? 'Masuk ke ChemVerse' : 'Daftar Akun ChemVerse'}
        </h1>
        <p className="login-subtitle">
          {authMode === 'login'
            ? 'Silakan masuk untuk melanjutkan pembelajaran sel elektrolisis'
            : 'Buat akun baru untuk mulai mencatat riwayat dan nilai belajar'}
        </p>
      </div>

      {/* Tab Switcher 1: Masuk (Login) vs Daftar (Register) */}
      <div className="auth-mode-tabs">
        <button
          type="button"
          className={`auth-mode-tab-btn ${authMode === 'login' ? 'active' : ''}`}
          onClick={() => handleSwitchMode('login')}
        >
          <LogIn size={16} />
          <span>Masuk (Login)</span>
        </button>

        <button
          type="button"
          className={`auth-mode-tab-btn ${authMode === 'register' ? 'active' : ''}`}
          onClick={() => handleSwitchMode('register')}
        >
          <UserPlus size={16} />
          <span>Daftar Akun Baru</span>
        </button>
      </div>

      {/* Tab Switcher 2: Siswa vs Guru */}
      <div className="role-switch-container">
        <button
          type="button"
          className={`role-switch-btn ${role === 'student' ? 'active' : ''}`}
          onClick={() => handleSwitchRole('student')}
        >
          <GraduationCap size={18} />
          <span>{authMode === 'login' ? 'Akun Siswa' : 'Daftar Siswa'}</span>
        </button>

        <button
          type="button"
          className={`role-switch-btn ${role === 'teacher' ? 'active' : ''}`}
          onClick={() => handleSwitchRole('teacher')}
        >
          <BookOpen size={18} />
          <span>{authMode === 'login' ? 'Akun Guru' : 'Daftar Guru'}</span>
        </button>
      </div>

      {/* Tombol Masuk / Lanjutkan dengan Akun Google */}
      <button
        type="button"
        className="google-auth-btn"
        onClick={handleGoogleSignIn}
        disabled={isLoadingGoogle || isLoadingEmail}
        title={`Masuk cepat dengan Akun Google (${role === 'student' ? 'Siswa' : 'Guru'})`}
      >
        {isLoadingGoogle ? (
          <Loader2 size={19} className="animate-spin text-primary" />
        ) : (
          <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span>
          {isLoadingGoogle
            ? 'Menghubungkan Akun Google...'
            : `Lanjutkan dengan Google (${role === 'student' ? 'Siswa' : 'Guru'})`}
        </span>
      </button>

      {/* Pemisah Garis Estetik */}
      <div className="auth-divider">
        <span>atau {authMode === 'login' ? 'masuk' : 'daftar'} dengan email & kata sandi</span>
      </div>

      {/* Form Otentikasi Email & Password */}
      <form onSubmit={handleSubmit} className="login-form">
        {errorMsg && (
          <div className="login-error-alert" role="alert">
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="login-success-alert" role="alert">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ==========================================================
              A. TAMPILAN FORM MASUK (LOGIN)
              ========================================================== */}
        {authMode === 'login' && (
          <>
            {/* Input Email / Nama / Username */}
            <div className="login-input-group">
              <label htmlFor="login-id" className="login-label">
                <Mail size={16} />
                <span>
                  {role === 'student'
                    ? 'Email, Nama Siswa, atau Username:'
                    : 'Email, Nama Guru, atau Username:'}
                </span>
              </label>
              <input
                id="login-id"
                type="text"
                className="login-input"
                placeholder={
                  role === 'student'
                      ? 'Contoh: siswa@gmail.com, elsa, atau Elsa'
                      : 'Contoh: guru@sekolah.sch.id, rahmawati'
                }
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                autoFocus
              />
            </div>

            {/* Input Kata Sandi */}
            <div className="login-input-group">
              <label htmlFor="login-pass" className="login-label">
                <Lock size={16} />
                <span>Kata Sandi:</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  id="login-pass"
                  type={showPassword ? 'text' : 'password'}
                  className="login-input password-input"
                  placeholder="Masukkan kata sandi akun Anda"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Tombol Masuk */}
            <button
              type="submit"
              disabled={isLoadingEmail || isLoadingGoogle}
              className={`login-submit-btn ${role === 'teacher' ? 'teacher-theme-btn' : ''}`}
            >
              {isLoadingEmail ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <span>
                    {role === 'student' ? 'Masuk sebagai Siswa' : 'Masuk ke Dashboard Guru'}
                  </span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Link ke Registrasi */}
            <div className="auth-switch-link-row">
              <span>Belum memiliki akun?</span>
              <button
                type="button"
                className="auth-link-text-btn"
                onClick={() => handleSwitchMode('register')}
              >
                Daftar akun di sini
              </button>
            </div>

            {/* Tombol Demo Cepat */}
            <button
              type="button"
              className="login-demo-btn"
              onClick={role === 'student' ? handleQuickDemoStudent : handleQuickDemoTeacher}
            >
              <Sparkles size={14} />
              <span>
                {role === 'student'
                  ? 'Masuk Cepat Demo Siswa (Elsa - Pass: 123)'
                  : 'Masuk Cepat Demo Guru (Ibu Rahmawati - Pass: 123)'}
              </span>
            </button>
          </>
        )}

        {/* ==========================================================
              B. TAMPILAN FORM DAFTAR (REGISTER SISWA)
              ========================================================== */}
        {authMode === 'register' && role === 'student' && (
          <>
            <div className="login-input-group">
              <label className="login-label">
                <User size={16} />
                <span>Nama Lengkap Siswa:</span>
              </label>
              <input
                type="text"
                className="login-input"
                placeholder="Contoh: Rian Hidayat"
                value={regFullName}
                onChange={(e) => {
                  setRegFullName(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                autoFocus
              />
            </div>

            {/* Email Siswa */}
            <div className="login-input-group">
              <label className="login-label">
                <Mail size={16} />
                <span>Alamat Email (Gmail / Akun Belajar):</span>
              </label>
              <input
                type="email"
                className="login-input"
                placeholder="Contoh: rian@gmail.com (untuk akun online Firebase)"
                value={regEmail}
                onChange={(e) => {
                  setRegEmail(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
              />
            </div>

            <div className="login-input-group">
              <label className="login-label">
                <User size={16} />
                <span>Username / NIS (Opsional):</span>
              </label>
              <input
                type="text"
                className="login-input"
                placeholder="Contoh: rian12 (huruf kecil)"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
              />
            </div>

            <div className="login-input-group">
              <label className="login-label">
                <School size={16} />
                <span>Pilihan Kelas:</span>
              </label>
              <select
                className="login-select"
                value={regClassName}
                onChange={(e) => setRegClassName(e.target.value)}
              >
                <option value="Kelas 12 IPA 1">Kelas 12 IPA 1</option>
                <option value="Kelas 12 IPA 2">Kelas 12 IPA 2</option>
                <option value="Kelas 12 IPA 3">Kelas 12 IPA 3</option>
                <option value="Fase F - Kimia 1">Fase F - Kimia 1</option>
                <option value="Fase F - Kimia 2">Fase F - Kimia 2</option>
                <option value="Lainnya">Tulis Kelas Sendiri...</option>
              </select>

              {regClassName === 'Lainnya' && (
                <input
                  type="text"
                  className="login-input login-custom-class-input"
                  placeholder="Tuliskan kelas Anda (misal: XII MIPA 4)"
                  value={regCustomClass}
                  onChange={(e) => setRegCustomClass(e.target.value)}
                />
              )}
            </div>

            <div className="login-input-group">
              <label className="login-label">
                <Lock size={16} />
                <span>Buat Kata Sandi:</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="login-input password-input"
                  placeholder="Minimal 3 karakter (min. 6 untuk Firebase)"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="login-input-group">
              <label className="login-label">
                <Lock size={16} />
                <span>Konfirmasi Kata Sandi:</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="login-input"
                placeholder="Ketik ulang kata sandi"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
              />
            </div>

              <button
                type="submit"
                disabled={isLoadingEmail || isLoadingGoogle}
                className="login-submit-btn"
              >
                {isLoadingEmail ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <UserPlus size={18} />
                    <span>Daftar Akun Siswa</span>
                  </>
                )}
              </button>

              <div className="auth-switch-link-row">
                <span>Sudah memiliki akun?</span>
                <button
                  type="button"
                  className="auth-link-text-btn"
                  onClick={() => handleSwitchMode('login')}
                >
                  Masuk di sini
                </button>
              </div>
            </>
          )}

            {/* ==========================================================
              C. TAMPILAN FORM DAFTAR (REGISTER GURU)
              ========================================================== */}
            {authMode === 'register' && role === 'teacher' && (
              <>
                <div className="login-input-group">
                  <label className="login-label">
                    <User size={16} />
                    <span>Nama Lengkap Guru (dengan Gelar):</span>
                  </label>
                  <input
                    type="text"
                    className="login-input"
                    placeholder="Contoh: Pak Hendra, S.Pd."
                    value={regTeacherName}
                    onChange={(e) => {
                      setRegTeacherName(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    autoFocus
                  />
                </div>

                {/* Email Guru */}
                <div className="login-input-group">
                  <label className="login-label">
                    <Mail size={16} />
                    <span>Alamat Email Guru (Kemdikbud / Gmail):</span>
                  </label>
                  <input
                    type="email"
                    className="login-input"
                    placeholder="Contoh: hendra@guru.sma.belajar.id"
                    value={regTeacherEmail}
                    onChange={(e) => {
                      setRegTeacherEmail(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                  />
                </div>

                <div className="login-input-group">
                  <label className="login-label">
                    <User size={16} />
                    <span>Username / NIP (Opsional):</span>
                  </label>
                  <input
                    type="text"
                    className="login-input"
                    placeholder="Contoh: hendra atau 19850101..."
                    value={regTeacherUsername}
                    onChange={(e) => setRegTeacherUsername(e.target.value)}
                  />
                </div>

                <div className="login-input-group">
                  <label className="login-label">
                    <School size={16} />
                    <span>Mata Pelajaran / Peran:</span>
                  </label>
                  <input
                    type="text"
                    className="login-input"
                    placeholder="Contoh: Guru Kimia SMA Kelas 12"
                    value={regTeacherTitle}
                    onChange={(e) => setRegTeacherTitle(e.target.value)}
                  />
                </div>

                <div className="login-input-group">
                  <label className="login-label">
                    <Lock size={16} />
                    <span>Buat Kata Sandi Guru:</span>
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="login-input password-input"
                      placeholder="Minimal 3 karakter (min. 6 untuk Firebase)"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMsg) setErrorMsg(null);
                      }}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="login-input-group">
                  <label className="login-label">
                    <Lock size={16} />
                    <span>Konfirmasi Kata Sandi Guru:</span>
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="login-input"
                    placeholder="Ketik ulang kata sandi"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                  />
                </div>

                  <button
                    type="submit"
                    disabled={isLoadingEmail || isLoadingGoogle}
                    className="login-submit-btn teacher-theme-btn"
                  >
                    {isLoadingEmail ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        <UserPlus size={18} />
                        <span>Daftar Akun Guru</span>
                      </>
                    )}
                  </button>

                  <div className="auth-switch-link-row">
                    <span>Sudah memiliki akun?</span>
                    <button
                      type="button"
                      className="auth-link-text-btn"
                      onClick={() => handleSwitchMode('login')}
                    >
                      Masuk di sini
                    </button>
                  </div>
                </>
          )}
              </form>

            {/* Footer Info Privasi */}
            <div className="login-footer-info">
              <ShieldCheck size={16} className="text-success" />
              <span>Sistem Pembelajaran Terintegrasi • Google Auth & Firebase Cloud</span>
            </div>
          </div>
    </div>
    );
};
