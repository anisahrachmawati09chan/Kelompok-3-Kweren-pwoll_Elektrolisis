import React from 'react';
import { GraduationCap, Users, ArrowRight, Zap, AlertCircle, Compass } from 'lucide-react';
import { FormulaRenderer } from '../../components/chemistry/FormulaRenderer';

interface HeroSectionProps {
  onStartLearning: () => void;
}

/**
 * HeroSection: Menampilkan judul utama, sasaran pengguna, penjelasan konsep sel elektrolisis,
 * dan Aturan Emas Laboratorium (Clean Academic Light Mode).
 */
export const HeroSection: React.FC<HeroSectionProps> = ({ onStartLearning }) => {
  return (
    <section className="hero-lab-section">
      <div className="container">
        {/* Tagline & Judul */}
        <div className="hero-header-box">
          <div className="hero-meta-badge">
            <Compass size={16} />
            <span>Lembar Belajar Laboratorium Terstruktur</span>
          </div>

          <h2 className="hero-main-title">
            Kuasai Konsep <span className="highlight-text">Sel Elektrolisis</span> SMA Kelas 12
          </h2>

          <p className="hero-lead-text">
            Selamat datang di <strong>ChemVerse</strong>. Platform pembelajaran digital kimia yang
            menghubungkan fenomena makroskopis laboratorium (gelembung gas, endapan logam) dengan
            aliran elektron di kawat luar dan reaksi redoks simbolis.
          </p>
        </div>

        {/* Sasaran Pengguna (User Persona PRD) */}
        <div className="persona-grid">
          <div className="persona-card">
            <div className="persona-icon-wrapper student-theme">
              <GraduationCap size={22} />
            </div>
            <div className="persona-info">
              <h3>Siswa SMA Kelas 12 (Fase F)</h3>
              <p>
                Belajar mandiri bertahap dari pemahaman redoks, identifikasi katode/anode, hingga
                prediksi produk lelehan dan larutan tanpa rasa bingung.
              </p>
            </div>
          </div>

          <div className="persona-card">
            <div className="persona-icon-wrapper teacher-theme">
              <Users size={22} />
            </div>
            <div className="persona-info">
              <h3>Guru Kimia SMA</h3>
              <p>
                Media demonstrasi visual di kelas untuk memperjelas mikroskopis perpindahan ion
                dan aliran elektron tanpa instalasi aplikasi khusus.
              </p>
            </div>
          </div>
        </div>

        {/* Kotak Penjelasan Singkat & Aturan Emas Elektrokimia */}
        <div className="lab-intro-sheet">
          <div className="lab-sheet-badge-strip">
            <span className="sheet-id">LEMBAR PANDUAN DASAR</span>
            <span className="sheet-topic">Materi: Sel Elektrolisis vs Sel Volta</span>
          </div>

          <div className="lab-sheet-body">
            <h3 className="lab-sheet-heading">
              Apa Itu Sel Elektrolisis?
            </h3>
            <p className="lab-sheet-paragraph">
              <strong>Sel Elektrolisis</strong> adalah sel elektrokimia yang menggunakan energi listrik searah (DC)
              untuk melangsungkan reaksi redoks yang <em>tidak spontan</em>. Berbeda dengan sel volta yang menghasilkan listrik,
              elektrolisis justru <em>membutuhkan sumber listrik</em> agar senyawa elektrolit dapat terurai menjadi unsur-unsurnya.
            </p>

            {/* Aturan Emas Elektrolisis (Laboratorium Quick Rules) */}
            <div className="rules-grid">
              {/* Kartu Katode */}
              <div className="rule-box katode-box">
                <div className="rule-header">
                  <span className="badge badge-katode">KATODE (-)</span>
                  <span className="rule-action">Tempat REDUKSI</span>
                </div>
                <div className="rule-formula-space">
                  <span className="formula-label">Contoh Penangkapan Elektron:</span>
                  <div className="chem-equation-inline">
                    <FormulaRenderer formula="Cu2+ + 2e- -> Cu(s)" />
                  </div>
                </div>
                <ul className="rule-notes">
                  <li>Terhubung ke kutub <strong>negatif (-)</strong> sumber arus.</li>
                  <li><strong>Kation (+)</strong> bergerak menuju katode untuk menangkap elektron.</li>
                </ul>
              </div>

              {/* Kartu Anode */}
              <div className="rule-box anode-box">
                <div className="rule-header">
                  <span className="badge badge-anode">ANODE (+)</span>
                  <span className="rule-action">Tempat OKSIDASI</span>
                </div>
                <div className="rule-formula-space">
                  <span className="formula-label">Contoh Pelepasan Elektron:</span>
                  <div className="chem-equation-inline">
                    <FormulaRenderer formula="2Cl- -> Cl2(g) + 2e-" />
                  </div>
                </div>
                <ul className="rule-notes">
                  <li>Terhubung ke kutub <strong>positif (+)</strong> sumber arus.</li>
                  <li><strong>Anion (-)</strong> bergerak menuju anode untuk melepas elektron.</li>
                </ul>
              </div>
            </div>

            {/* Catatan Keselamatan Konseptual PRD */}
            <div className="concept-notice">
              <AlertCircle size={20} className="notice-icon" />
              <div>
                <strong>Prinsip Penting Alur Muatan:</strong> Elektron mengalir hanya melalui kawat penghubung luar
                (dari anode menuju kutub positif sumber arus, lalu dipompa ke katode).
                <em> Elektron tidak pernah mengalir bebas di dalam larutan elektrolit</em>; muatan dalam cairan dihantarkan oleh migrasi ion.
              </div>
            </div>

            {/* Tombol CTA Mulai Belajar */}
            <div className="hero-cta-wrapper">
              <button
                type="button"
                className="btn btn-primary btn-lg pulse-hover-btn"
                onClick={onStartLearning}
              >
                <span>Mulai Belajar Modul 1: Dasar Elektrokimia</span>
                <ArrowRight size={20} />
              </button>
              <span className="cta-caption">
                <Zap size={14} className="caption-icon" />
                Langsung belajar tanpa login • Akses gratis & terbuka
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

