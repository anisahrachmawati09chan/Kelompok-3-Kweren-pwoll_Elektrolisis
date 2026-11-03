import React from 'react';
import { FlaskConical, Atom } from 'lucide-react';

interface HeaderProps {
  onOpenModule1?: () => void;
}

/**
 * Header ChemVerse - Bersih, akademis, dan mudah ditelusuri.
 * Cocok untuk pembelajaran mandiri siswa dan presentasi guru di kelas.
 */
export const Header: React.FC<HeaderProps> = ({ onOpenModule1 }) => {
  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Logo & Judul Aplikasi */}
        <div className="brand-group">
          <div className="brand-icon-box" aria-hidden="true">
            <FlaskConical className="brand-icon" size={24} />
          </div>
          <div className="brand-text">
            <div className="brand-title-row">
              <h1 className="brand-name">ChemVerse</h1>
              <span className="curriculum-pill">Fase F SMA</span>
            </div>
            <p className="brand-tagline">Laboratorium & Lembar Belajar Virtual Sel Elektrolisis</p>
          </div>
        </div>

        {/* Status Akses & Tombol Aksi Cepat */}
        <div className="header-actions">
          <div className="badge-public-access" title="Akses Terbuka untuk Siswa & Guru">
            <Atom size={14} className="icon-pulse" />
            <span>Mode Mandiri (Tanpa Login)</span>
          </div>

          {onOpenModule1 && (
            <button
              type="button"
              className="btn btn-primary btn-sm header-cta"
              onClick={onOpenModule1}
            >
              Lembar Modul 1
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

