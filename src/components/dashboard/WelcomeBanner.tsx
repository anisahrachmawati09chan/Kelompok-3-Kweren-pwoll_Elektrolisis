import React from 'react';
import { ArrowRight, Sparkles, Atom } from 'lucide-react';

interface WelcomeBannerProps {
  studentName?: string;
  onStartLearning: () => void;
}

/**
 * WelcomeBanner: 2 banner atas persis seperti gambar referensi:
 * 1. Banner Peach: Sambutan ramah siswa disesuaikan dengan nama siswa yang login,
 *    serta penjelasan konsep sel elektrolisis.
 * 2. Banner Putih/Lavender: Ajakan belajar Modul 1 dengan link CTA dan perolehan poin XP.
 */
export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  studentName = 'Elsa',
  onStartLearning,
}) => {
  // Ambil nama panggilan pertama untuk sapaan hangat, atau nama lengkap jika pendek
  const trimmed = studentName.trim();
  const firstName = trimmed ? trimmed.split(' ')[0] : 'Siswa';

  return (
    <div className="banners-grid-row">
      {/* 1. Banner Peach (Sambutan Personal & Penjelasan Konsep) */}
      <div className="banner-card greeting-banner">
        <div className="greeting-banner-content">
          <h2 className="greeting-heading">Selamat Belajar, {firstName}!</h2>
          <p className="greeting-text">
            Kuasai konsep <strong>Sel Elektrolisis SMA Kelas 12</strong>. Pelajari bagaimana arus listrik searah (DC)
            mengurai senyawa menjadi unsur melalui reaksi redoks tidak spontan!
          </p>
          <div className="greeting-pill-badge">
            <Sparkles size={14} />
            <span>Fase F Kurikulum Merdeka</span>
          </div>
        </div>

        {/* Ilustrasi Vektor Karakter Siswa Belajar */}
        <div className="greeting-illustration-box" aria-hidden="true">
          <svg viewBox="0 0 120 120" width="110" height="110" fill="none">
            <circle cx="60" cy="60" r="50" fill="#fde68a" />
            {/* Karakter Siswa */}
            <circle cx="60" cy="45" r="18" fill="#fca5a5" />
            <path d="M42 45 C42 32 78 32 78 45 C78 42 70 30 60 30 C50 30 42 42 42 45 Z" fill="#1e1b4b" />
            <path d="M38 90 C38 68 82 68 82 90 Z" fill="#312e81" />
            {/* Laptop Siswa */}
            <rect x="42" y="72" width="36" height="22" rx="3" fill="#ffffff" />
            <rect x="45" y="75" width="30" height="16" rx="2" fill="#3b82f6" />
            <polygon points="56,80 56,86 64,83" fill="#ffffff" />
            <path d="M36 94 L84 94 L80 97 L40 97 Z" fill="#cbd5e1" />
          </svg>
        </div>
      </div>

      {/* 2. Banner Promo Modul 1 (Putih/Lavender) */}
      <div className="banner-card target-banner">
        <div className="target-banner-content">
          <h3 className="target-title">Target Modul 1: Dasar Elektrokimia</h3>
          <p className="target-desc">
            Pelajari konsep pelepasan & penerimaan elektron, aturan KRAO (Katode Reduksi, Anode Oksidasi), dan komponen sel!
          </p>
          <div className="target-action-row">
            <span className="reward-coin-pill">
              <Sparkles size={12} />
              <span>+50 XP</span>
            </span>
            <button
              type="button"
              className="banner-link-btn"
              onClick={onStartLearning}
            >
              <span>Buka Lembar Modul</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Graphic Box */}
        <div className="target-banner-graphic" aria-hidden="true">
          <div style={{ textAlign: 'center' }}>
            <Atom size={44} className="icon-pulse" />
            <div style={{ fontSize: '0.65rem', fontWeight: 800, marginTop: '4px', letterSpacing: '0.05em' }}>
              MODUL 1
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
