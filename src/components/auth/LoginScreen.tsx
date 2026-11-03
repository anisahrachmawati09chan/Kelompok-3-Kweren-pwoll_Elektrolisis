import React, { useState } from 'react';
import { FlaskConical, User, School, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export interface StudentProfile {
  name: string;
  className: string;
}

interface LoginScreenProps {
  onLogin: (profile: StudentProfile) => void;
  defaultName?: string;
  defaultClass?: string;
}

/**
 * LoginScreen: Halaman awal masuk siswa sebelum mengakses beranda utama.
 * Meminta Nama dan Kelas siswa, kemudian menyimpan profil dan mengarahkan
 * siswa ke beranda utama dengan ucapan selamat belajar yang dipersonalisasi.
 */
export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  defaultName = '',
  defaultClass = 'Kelas 12 IPA 1',
}) => {
  const [name, setName] = useState<string>(defaultName);
  const [className, setClassName] = useState<string>(defaultClass);
  const [customClass, setCustomClass] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim();
    const finalClass = (className === 'Lainnya' ? customClass : className).trim();

    if (!finalName) {
      setErrorMsg('Silakan masukkan nama Anda terlebih dahulu.');
      return;
    }

    if (!finalClass) {
      setErrorMsg('Silakan pilih atau masukkan kelas Anda.');
      return;
    }

    setErrorMsg(null);
    onLogin({
      name: finalName,
      className: finalClass,
    });
  };

  const handleQuickDemo = () => {
    setName('Elsa Rasengraffe');
    setClassName('Kelas 12 IPA 1');
    setErrorMsg(null);
    onLogin({
      name: 'Elsa Rasengraffe',
      className: 'Kelas 12 IPA 1',
    });
  };

  return (
    <div className="login-screen-wrapper">
      <div className="login-card">
        {/* Header Kartu Login */}
        <div className="login-header">
          <div className="login-icon-badge">
            <FlaskConical size={28} />
          </div>
          <span className="login-curriculum-tag">Fase F Kurikulum Merdeka</span>
          <h1 className="login-title">Selamat Datang di ChemVerse</h1>
          <p className="login-subtitle">
            Platform Belajar Interaktif Sel Elektrolisis Kimia SMA Kelas 12
          </p>
        </div>

        {/* Form Masuk Siswa */}
        <form onSubmit={handleSubmit} className="login-form">
          {errorMsg && (
            <div className="login-error-alert" role="alert">
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Input Nama Siswa */}
          <div className="login-input-group">
            <label htmlFor="student-name" className="login-label">
              <User size={16} />
              <span>Nama Siswa:</span>
            </label>
            <input
              id="student-name"
              type="text"
              className="login-input"
              placeholder="Contoh: Elsa Rasengraffe atau Budi Santoso"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              autoFocus
            />
          </div>

          {/* Pilihan Kelas */}
          <div className="login-input-group">
            <label htmlFor="student-class" className="login-label">
              <School size={16} />
              <span>Kelas:</span>
            </label>
            <select
              id="student-class"
              className="login-select"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            >
              <option value="Kelas 12 IPA 1">Kelas 12 IPA 1</option>
              <option value="Kelas 12 IPA 2">Kelas 12 IPA 2</option>
              <option value="Kelas 12 IPA 3">Kelas 12 IPA 3</option>
              <option value="Fase F - Kimia 1">Fase F - Kimia 1</option>
              <option value="Fase F - Kimia 2">Fase F - Kimia 2</option>
              <option value="Lainnya">Tulis Kelas Sendiri...</option>
            </select>

            {className === 'Lainnya' && (
              <input
                type="text"
                className="login-input login-custom-class-input"
                placeholder="Tuliskan kelas Anda (misal: XII MIPA 4)"
                value={customClass}
                onChange={(e) => setCustomClass(e.target.value)}
              />
            )}
          </div>

          {/* Tombol Masuk */}
          <button type="submit" className="login-submit-btn">
            <span>Masuk ke Beranda ChemVerse</span>
            <ArrowRight size={18} />
          </button>

          {/* Opsi Cepat Demo */}
          <button
            type="button"
            className="login-demo-btn"
            onClick={handleQuickDemo}
          >
            <Sparkles size={14} />
            <span>Isi Cepat sebagai Elsa (12 IPA 1)</span>
          </button>
        </form>

        {/* Footer Info Privasi */}
        <div className="login-footer-info">
          <ShieldCheck size={16} className="text-success" />
          <span>Tanpa kata sandi • 100% Akses Belajar Bebas & Mandiri</span>
        </div>
      </div>
    </div>
  );
};

