import React from 'react';
import type { Chapter, Subtopic } from '../../data/courseData';
import { FormulaRenderer } from '../../components/chemistry/FormulaRenderer';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  Flame,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';

interface Module1CardProps {
  module: Chapter;
  onOpenStudySheet: (subtopicId?: string) => void;
}

/**
 * Module1Card: Kartu Modul 1 aktif yang menjadi fokus beranda satu materi.
 * Menampilkan rincian kompetensi, kartu bagian belajar, dan tombol interaktif Mulai Belajar.
 */
export const Module1Card: React.FC<Module1CardProps> = ({ module, onOpenStudySheet }) => {
  return (
    <section className="module-focus-section" id="modul-1-section">
      <div className="container">
        {/* Header Lembar Modul */}
        <div className="section-title-bar">
          <div className="title-left">
            <span className="section-kicker">KURIKULUM BERURUTAN • MODUL INTI</span>
            <h2 className="section-heading">Modul 1: {module.title}</h2>
            <p className="section-subheading">{module.tagline}</p>
          </div>
          <div className="title-right">
            <span className="badge badge-success">
              <CheckCircle2 size={14} />
              <span>{module.statusLabel}</span>
            </span>
          </div>
        </div>

        {/* Kartu Utama Berorientasi Lembar Laboratorium */}
        <div className="lab-sheet-card active-module-card">
          {/* Metadata Bar */}
          <div className="lab-meta-bar">
            <div className="meta-item">
              <BookOpen size={16} className="meta-icon" />
              <span><strong>Materi:</strong> Fase F Kimia SMA</span>
            </div>
            <div className="meta-item">
              <Clock size={16} className="meta-icon" />
              <span><strong>Estimasi:</strong> ~45 Menit</span>
            </div>
            <div className="meta-item">
              <Award size={16} className="meta-icon" />
              <span><strong>Lencana:</strong> {module.badgeName}</span>
            </div>
            <div className="meta-item highlight">
              <Flame size={16} className="meta-icon text-amber" />
              <span><strong>Status:</strong> Terbuka Bebas</span>
            </div>
          </div>

          <div className="lab-card-body">
            {/* Ringkasan & Sasaran Modul */}
            <div className="module-summary-box">
              <h3 className="box-title">Deskripsi & Capaian Belajar</h3>
              <p className="box-desc">{module.description}</p>

              <div className="competencies-checklist">
                <h4>Kemampuan yang Akan Dikuasai:</h4>
                <ul className="comp-list">
                  {module.competencies.map((comp, idx) => (
                    <li key={idx} className="comp-item">
                      <CheckCircle2 size={16} className="check-icon" />
                      <span>{comp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Kartu Bagian Belajar (Subtopik 1.1 - 1.4) */}
            <div className="subtopics-container">
              <div className="subtopics-header">
                <div className="subtopics-title-group">
                  <Layers size={18} className="subtopics-icon" />
                  <h3 className="box-title">Daftar Bagian Belajar Laboratorium</h3>
                </div>
                <span className="text-muted text-sm">4 Bagian Terstruktur</span>
              </div>

              <div className="subtopics-grid">
                {module.subtopics.map((sub: Subtopic) => (
                  <div
                    key={sub.id}
                    className="subtopic-card"
                    onClick={() => onOpenStudySheet(sub.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        onOpenStudySheet(sub.id);
                      }
                    }}
                    title={`Klik untuk membaca materi ${sub.title}`}
                  >
                    <div className="subtopic-card-header">
                      <span className="subtopic-id-tag">Bagian {sub.id}</span>
                      <span className="subtopic-duration">{sub.duration}</span>
                    </div>

                    <h4 className="subtopic-title">{sub.title}</h4>
                    <p className="subtopic-desc">{sub.description}</p>

                    {/* Ruang Rumus Spesifik yang Lega */}
                    {sub.keyFormula && (
                      <div className="subtopic-formula-badge">
                        <span className="formula-kicker">Fokus Reaksi:</span>
                        <div className="formula-text">
                          <FormulaRenderer formula={sub.keyFormula} />
                        </div>
                      </div>
                    )}

                    <div className="subtopic-action-hint">
                      <span>Buka Bagian Ini</span>
                      <ChevronRight size={16} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tombol Mulai Belajar Modul 1 */}
            <div className="module-cta-bottom">
              <div className="cta-info">
                <strong>Siap memulai pembelajaran dasar?</strong>
                <p>Buka lembar belajar lengkap untuk mempelajari teori redoks, komparasi tabel, dan notasi rumus.</p>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-lg start-btn"
                onClick={() => onOpenStudySheet('1.1')}
              >
                <span>Mulai Belajar Modul 1</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
