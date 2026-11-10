import React from 'react';
import { Zap, Scale, FlaskConical, CheckSquare } from 'lucide-react';

interface LearningCardsRowProps {
  onSelectSubtopic: (subtopicId: string) => void;
  onSeeAll: () => void;
}

/**
 * LearningCardsRow: 4 kartu bagian belajar Modul 1
 * Mengikuti baris "Popular services" pada gambar referensi dengan:
 * - Icon berwarna dalam lingkaran bubble
 * - Judul subtopik
 * - Keterangan durasi & deskripsi
 * - Garis progres horizontal warna-warni
 */
export const LearningCardsRow: React.FC<LearningCardsRowProps> = ({
  onSelectSubtopic,
  onSeeAll,
}) => {
  const cards = [
    {
      id: '1.1',
      title: '1.1 Reaksi Redoks',
      category: 'Pelepasan & Penerimaan e⁻',
      theme: 'theme-purple',
      fillClass: 'fill-purple',
      icon: Zap,
      progressPercent: 100,
      metricLabel: 'Siap Belajar',
    },
    {
      id: '1.2',
      title: '1.2 Volta vs Elektrolisis',
      category: 'Komparasi Spontanitas & Kutub',
      theme: 'theme-yellow',
      fillClass: 'fill-yellow',
      icon: Scale,
      progressPercent: 100,
      metricLabel: 'Aturan PANIC',
    },
    {
      id: '1.3',
      title: '1.3 Komponen Sel',
      category: 'Sumber DC, Katode, Anode, Cairan',
      theme: 'theme-cyan',
      fillClass: 'fill-cyan',
      icon: FlaskConical,
      progressPercent: 100,
      metricLabel: 'Alat Lab',
    },
    {
      id: '1.4',
      title: '1.4 Cek Pemahaman',
      category: '4 Soal Evaluasi & Analisis Reaksi',
      theme: 'theme-rose',
      fillClass: 'fill-rose',
      icon: CheckSquare,
      progressPercent: 100,
      metricLabel: '4 Soal Siap',
    },
  ];

  return (
    <section className="section-block">
      <div className="section-header-row">
        <h3 className="section-main-heading">Bagian Belajar Utama (Modul 1)</h3>
        <button
          type="button"
          className="see-all-link"
          onClick={onSeeAll}
        >
          Buka Semua Lembar &gt;
        </button>
      </div>

      <div className="learning-cards-grid">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.id}
              className="learning-card-modern"
              onClick={() => onSelectSubtopic(card.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectSubtopic(card.id);
                }
              }}
              title={`Klik untuk membuka materi ${card.title}`}
            >
              {/* Header Kartu: Ikon Bubble & Judul */}
              <div className="learning-card-top">
                <div className={`card-icon-bubble ${card.theme}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <h4 className="card-title-text">{card.title}</h4>
                </div>
              </div>

              {/* Kategori Deskripsi */}
              <p className="card-request-stat">{card.category}</p>

              {/* Progress Bar Horizontal */}
              <div className="card-progress-zone">
                <div className="progress-track-bg">
                  <div
                    className={`progress-track-fill ${card.fillClass}`}
                    style={{ width: `${card.progressPercent}%` }}
                  />
                </div>
                <div className="card-footer-metric">
                  {card.metricLabel}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

