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
} from 'lucide-react';
import type { UserProfile, StudentProfile, TeacherProfile } from '../../utils/studentRecords';
import { authStore } from '../../utils/authStore';

interface LoginScreenProps {
  onLogin: (profile: UserProfile) => void;
  defaultClass?: string;
}

/**
 * LoginScreen: Halaman Otentikasi ChemVerse
 * Mendukung 2 Mode:
 * 1. Mode Masuk (Login)
 * 2. Mode Daftar (Register / Buat Akun Baru)
 * Serta mendukung 2 Peran: Akun Siswa & Akun Guru.
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
  const [identifier, setIdentifier] = useState<string>(''); // Nama atau username untuk login
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Input Khusus Pendaftaran Siswa
  const [regFullName, setRegFullName] = useState<string>('');
  const [regUsername, setRegUsername] = useState<string>('');
  const [regClassName, setRegClassName] = useState<string>(defaultClass);
  const [regCustomClass, setRegCustomClass] = useState<string>('');

  // Input Khusus Pendaftaran Guru
  const [regTeacherName, setRegTeacherName] = useState<string>('');
  const [regTeacherUsername, setRegTeacherUsername] = useState<string>('');
  const [regTeacherTitle, setRegTeacherTitle] = useState<string>('Guru Kimia SMA Kelas 12');

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

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
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
        setErrorMsg(`Silakan masukkan nama atau username ${role === 'student' ? 'siswa' : 'guru'}.`);
        return;
      }

      if (!cleanPass) {
        setErrorMsg('Silakan masukkan kata sandi Anda.');
        return;
      }

      const res = authStore.login(cleanId, cleanPass, role);
      if (!res.success || !res.account) {
        setErrorMsg(res.message);
        return;
      }

      // Login berhasil! Buat profile dan kirim ke App
      if (res.account.role === 'student') {
        const studentProfile: StudentProfile = {
          role: 'student',
          name: res.account.name,
          className: res.account.className || 'Kelas 12 IPA 1',
        };
        onLogin(studentProfile);
      } else {
        const teacherProfile: TeacherProfile = {
          role: 'teacher',
          name: res.account.name,
          title: res.account.title || 'Guru Kimia SMA Kelas 12',
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
          setErrorMsg('Kata sandi minimal 3 karakter.');
          return;
        }

        if (password !== confirmPassword) {
          setErrorMsg('Konfirmasi kata sandi tidak cocok. Silakan periksa kembali.');
          return;
        }

        const res = authStore.register({
          role: 'student',
          name: cleanName,
          username: cleanUname,
          password: password,
          className: cleanClass,
        });

        if (!res.success) {
          setErrorMsg(res.message);
          return;
        }

        // Pendaftaran berhasil! Otomatis login akun baru
        setSuccessMsg('Akun siswa berhasil dibuat! Sedang masuk...');
        setTimeout(() => {
          onLogin({
            role: 'student',
            name: cleanName,
            className: cleanClass,
          });
        }, 700);
      } else {
        // Pendaftaran Guru
        const cleanTeacherName = regTeacherName.trim();
        const cleanTeacherUname = (regTeacherUsername.trim() || cleanTeacherName.toLowerCase().replace(/\s+/g, '')).toLowerCase();
        const cleanTitle = regTeacherTitle.trim() || 'Guru Kimia SMA Kelas 12';

        if (!cleanTeacherName) {
          setErrorMsg('Nama lengkap guru wajib diisi.');
          return;
        }

        if (password.length < 3) {
          setErrorMsg('Kata sandi minimal 3 karakter.');
          return;
        }

        if (password !== confirmPassword) {
          setErrorMsg('Konfirmasi kata sandi tidak cocok. Silakan periksa kembali.');
          return;
        }

        const res = authStore.register({
          role: 'teacher',
          name: cleanTeacherName,
          username: cleanTeacherUname,
          password: password,
          title: cleanTitle,
        });

        if (!res.success) {
          setErrorMsg(res.message);
          return;
        }

        // Pendaftaran berhasil! Otomatis login guru
        setSuccessMsg('Akun guru berhasil dibuat! Sedang membuka Dashboard Guru...');
        setTimeout(() => {
          onLogin({
            role: 'teacher',
            name: cleanTeacherName,
            title: cleanTitle,
          });
        }, 700);
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
    });
  };

  const handleQuickDemoTeacher = () => {
    setErrorMsg(null);
    onLogin({
      role: 'teacher',
      name: 'Ibu Rahmawati, M.Pd.',
      title: 'Guru Kimia SMA Kelas 12',
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

        {/* Form Otentikasi */}
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
              {/* Input Nama / Username */}
              <div className="login-input-group">
                <label htmlFor="login-id" className="login-label">
                  <User size={16} />
                  <span>{role === 'student' ? 'Nama Siswa atau Username:' : 'Nama Guru atau Username:'}</span>
                </label>
                <input
                  id="login-id"
                  type="text"
                  className="login-input"
                  placeholder={
                    role === 'student'
                      ? 'Contoh: Elsa Rasengraffe atau elsa'
                      : 'Contoh: Ibu Rahmawati, M.Pd. atau rahmawati'
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
                    placeholder="Masukkan kata sandi (Akun demo: 123)"
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
                className={`login-submit-btn ${role === 'teacher' ? 'teacher-theme-btn' : ''}`}
              >
                <span>{role === 'student' ? 'Masuk sebagai Siswa' : 'Masuk ke Dashboard Guru'}</span>
                <ArrowRight size={18} />
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

              <div className="login-input-group">
                <label className="login-label">
                  <User size={16} />
                  <span>Username / NIS:</span>
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
                    placeholder="Minimal 3 karakter"
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

              <button type="submit" className="login-submit-btn">
                <UserPlus size={18} />
                <span>Daftar Akun Siswa</span>
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

              <div className="login-input-group">
                <label className="login-label">
                  <User size={16} />
                  <span>Username / NIP:</span>
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
                    placeholder="Minimal 3 karakter"
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

              <button type="submit" className="login-submit-btn teacher-theme-btn">
                <UserPlus size={18} />
                <span>Daftar Akun Guru</span>
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
          <span>Sistem Pembelajaran Mandiri • Akun Tersimpan di Browser Lokal</span>
        </div>
      </div>
    </div>
  );
};
