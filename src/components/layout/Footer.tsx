import React from 'react';
import { ShieldCheck, BookOpen, Heart } from 'lucide-react';

const CURRENT_YEAR = 2026;

/**
 * Footer Akademik ChemVerse
 * Menegaskan prinsip: Tanpa pengumpulan data pribadi, tanpa biaya, berfokus murni pada konsep kimia.
 */
export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <div className="footer-top">
          <div className="footer-brand">
            <h4>ChemVerse • Modul Elektrolisis</h4>
            <p>
              Media pembelajaran digital interaktif berbasis Kurikulum Merdeka Fase F Kimia SMA Kelas 12.
              Membimbing siswa memahami perubahan energi listrik menjadi energi kimia, aturan elektroda,
              serta reaksi redoks secara mikroskopis dan simbolis.
            </p>
          </div>

          <div className="footer-badges">
            <div className="footer-badge-item">
              <ShieldCheck size={18} className="text-success" />
              <div>
                <strong>Privasi Terjamin</strong>
                <span>Tidak meminta data siswa, tanpa registrasi, tanpa iklan berbayar.</span>
              </div>
            </div>

            <div className="footer-badge-item">
              <BookOpen size={18} className="text-primary" />
              <div>
                <strong>Berstandar PRD Kimia SMA</strong>
                <span>Notasi setara atom & muatan, tetapan F = 96.485 C/mol.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {CURRENT_YEAR} ChemVerse Laboratorium Kimia SMA. Dibangun untuk kemudahan belajar sains.</p>
          <p className="footer-note">
            Dirancang dengan <Heart size={14} className="heart-icon" /> untuk siswa & guru kimia Indonesia.
          </p>
        </div>
      </div>
    </footer>
  );
};
