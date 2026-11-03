import React from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * ChemistryStatsWidget: Mengikuti kartu "Order statistics" pada gambar referensi.
 * Menampilkan:
 * - Latar belakang Deep Navy (#242163)
 * - Tiga metrik kuantitatif di sebelah kiri (Target Subtopik, Tetapan Faraday, Status Belajar)
 * - Donut ring chart SVG melingkar dengan persentase di tengah
 * - Legenda konsep kimia elektrokimia di sebelah kanan
 */
export const ChemistryStatsWidget: React.FC = () => {
  return (
    <div className="navy-stats-widget">
      {/* Header Widget */}
      <div className="widget-header-row">
        <h4 className="widget-title">Statistik Elektrokimia</h4>
        <div className="widget-dropdown-btn">
          <span>Modul 1</span>
          <ChevronDown size={14} />
        </div>
      </div>

      {/* Grid 3 Kolom Widget */}
      <div className="widget-body-grid">
        {/* Kolom 1: Angka Kuantitatif */}
        <div className="stats-numeric-col">
          <div className="stat-metric-row">
            <span className="stat-metric-label">Target Subtopik</span>
            <span className="stat-metric-value">4 Bagian</span>
          </div>
          <div className="stat-metric-row">
            <span className="stat-metric-label">Tetapan Faraday</span>
            <span className="stat-metric-value">96.485 C/mol</span>
          </div>
          <div className="stat-metric-row">
            <span className="stat-metric-label">Status Kursus</span>
            <span className="stat-metric-value">Modul 1 Aktif</span>
          </div>
        </div>

        {/* Kolom 2: Donut Chart SVG */}
        <div className="stats-donut-col">
          <div className="donut-svg-wrapper">
            <svg viewBox="0 0 100 100" className="donut-svg">
              {/* Lingkaran Dasar */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="10"
              />
              {/* Segmen 1: Katode Reduksi (Cyan) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="10"
                strokeDasharray="60 200"
                strokeDashoffset="0"
                strokeLinecap="round"
              />
              {/* Segmen 2: Anode Oksidasi (Rose/Red) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="10"
                strokeDasharray="50 200"
                strokeDashoffset="-65"
                strokeLinecap="round"
              />
              {/* Segmen 3: Arus DC (Amber/Yellow) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="10"
                strokeDasharray="45 200"
                strokeDashoffset="-120"
                strokeLinecap="round"
              />
              {/* Segmen 4: Elektrolit (Purple) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="10"
                strokeDasharray="35 200"
                strokeDashoffset="-170"
                strokeLinecap="round"
              />
            </svg>

            {/* Teks di Tengah Donut */}
            <div className="donut-center-text">
              <span className="donut-main-number">100%</span>
              <span className="donut-sub-label">Dasar Siap</span>
            </div>
          </div>
        </div>

        {/* Kolom 3: Legenda Warna */}
        <div className="stats-legend-col">
          <div className="legend-item">
            <span className="legend-dot dot-cyan" />
            <span>Katode (Red)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-rose" />
            <span>Anode (Oks)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-yellow" />
            <span>Sumber Arus DC</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-purple" />
            <span>Elektrolit</span>
          </div>
        </div>
      </div>
    </div>
  );
};

