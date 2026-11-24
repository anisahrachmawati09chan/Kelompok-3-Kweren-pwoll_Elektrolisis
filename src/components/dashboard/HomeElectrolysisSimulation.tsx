import React, { useState } from 'react';
import { FlaskConical, Maximize2, RotateCcw, Sparkles, BookOpen, Zap } from 'lucide-react';

interface HomeElectrolysisSimulationProps {
  onOpenFullLab: () => void;
}

/**
 * HomeElectrolysisSimulation: Bahan Animasi Belajar di Bagian Beranda
 * Menampilkan simulasi laboratorium interaktif sel elektrolisis langsung di beranda (homepage)
 * sebagai media bantu siswa memahami konsep reaksi redoks, aliran elektron, dan migrasi partikel.
 */
export const HomeElectrolysisSimulation: React.FC<HomeElectrolysisSimulationProps> = ({
  onOpenFullLab,
}) => {
  const [reloadCounter, setReloadCounter] = useState<number>(0);

  const handleReload = () => {
    setReloadCounter((prev) => prev + 1);
  };

  return (
    <section className="home-simulation-section" aria-label="Bahan Animasi Belajar Sel Elektrolisis">
      {/* Header Bagian Animasi Belajar */}
      <div className="simulation-section-header">
        <div className="simulation-header-info">
          <div className="simulation-badge-icon">
            <FlaskConical size={22} />
          </div>
          <div>
            <div className="simulation-tag-pill">
              <Sparkles size={13} />
              <span>Bahan Animasi Belajar Interaktif</span>
              <span className="live-dot" />
              <span className="live-text">Simulasi Siap</span>
            </div>
            <h3 className="simulation-title">
              Visualisasi &amp; Animasi Partikel Sel Elektrolisis
            </h3>
            <p className="simulation-subtitle">
              Amati langsung pergerakan kation ke katode (−), anion ke anode (＋), aliran elektron
              kawat luar, dan pembentukan produk reaksi redoks secara real-time.
            </p>
          </div>
        </div>

        <div className="simulation-header-actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm simulation-ctrl-btn"
            onClick={handleReload}
            title="Muat ulang simulasi dari kondisi awal"
          >
            <RotateCcw size={15} />
            <span>Reset Animasi</span>
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm simulation-ctrl-btn"
            onClick={onOpenFullLab}
            title="Buka Lab Virtual dalam mode layar penuh (Papan Banding & Rekap Misi)"
          >
            <Maximize2 size={15} />
            <span>Buka Layar Penuh</span>
          </button>
        </div>
      </div>

      {/* Frame Card Animasi Interaktif */}
      <div className="home-simulation-card">
        <div className="simulation-frame-wrapper">
          <iframe
            key={reloadCounter}
            src="/lab-virtual.html"
            title="Animasi Interaktif Laboratorium Sel Elektrolisis"
            className="home-simulation-iframe"
            allow="fullscreen"
          />
        </div>

        {/* Ringkasan Konsep Kunci Guru */}
        <div className="simulation-summary-bar">
          <div className="summary-rule-item">
            <div className="summary-dot katode" />
            <span>
              <strong>Katode (−):</strong> Kutub negatif, tempat terjadinya <em>reduksi</em> (kation
              menangkap e⁻).
            </span>
          </div>

          <div className="summary-rule-item">
            <div className="summary-dot anode" />
            <span>
              <strong>Anode (＋):</strong> Kutub positif, tempat terjadinya <em>oksidasi</em> (anion
              atau elektroda aktif melepas e⁻).
            </span>
          </div>

          <div className="summary-rule-item">
            <Zap size={15} color="#eab308" />
            <span>
              <strong>Aturan Emas:</strong> <em>KRAO</em> (Katode Reduksi, Anode Oksidasi) &amp;{' '}
              <em>PANIC</em> (Positive Anode, Negative Is Cathode).
            </span>
          </div>

          <div className="summary-rule-item">
            <BookOpen size={15} color="#6366f1" />
            <span>
              Elektron mengalir melalui kawat luar dari <strong>Anode (＋) menuju Katode (−)</strong>.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
