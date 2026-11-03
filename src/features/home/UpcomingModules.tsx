import React from 'react';
import type { Chapter } from '../../data/courseData';
import { Lock, Clock, Calendar, AlertCircle } from 'lucide-react';

interface UpcomingModulesProps {
  chapters: Chapter[];
}

/**
 * UpcomingModules: Menampilkan peta belajar modul lanjutan (Bab 2 - 5)
 * dengan status jujur "Belum Tersedia" sesuai roadmap PRD.
 */
export const UpcomingModules: React.FC<UpcomingModulesProps> = ({ chapters }) => {
  // Hanya ambil Bab 2 sampai Bab 5
  const upcomingList = chapters.filter((c) => c.id !== 1);

  return (
    <section className="upcoming-roadmap-section">
      <div className="container">
        <div className="roadmap-header">
          <div className="roadmap-title-group">
            <span className="section-kicker">PETA JALUR BELAJAR BERIKUTNYA</span>
            <h2 className="section-heading">Rencana Modul Lanjutan</h2>
            <p className="section-subheading">
              Sesuai PRD ElectroLab, modul berikut dibuka secara bertahap setelah penguasaan konsep dasar elektrokimia.
            </p>
          </div>

          <div className="roadmap-legend">
            <span className="badge badge-locked">
              <Lock size={12} />
              <span>Status: Belum Tersedia</span>
            </span>
          </div>
        </div>

        <div className="upcoming-grid">
          {upcomingList.map((ch) => (
            <div key={ch.id} className="upcoming-card locked-card">
              {/* Header Kartu Terkunci */}
              <div className="locked-card-header">
                <div className="chapter-order-pill">Bab {ch.chapterNumber}</div>
                <span className="badge badge-locked status-badge">
                  <Lock size={12} />
                  <span>Belum Tersedia</span>
                </span>
              </div>

              {/* Judul & Deskripsi */}
              <h3 className="locked-card-title">{ch.title}</h3>
              <p className="locked-card-tagline">{ch.tagline}</p>
              <p className="locked-card-desc">{ch.description}</p>

              {/* Rencana Subtopik */}
              <div className="planned-subtopics">
                <span className="planned-kicker">Rencana Aktivitas:</span>
                <ul className="planned-list">
                  {ch.subtopics.slice(0, 3).map((sub) => (
                    <li key={sub.id} className="planned-item">
                      <span className="bullet-locked">•</span>
                      <span>{sub.title}</span>
                    </li>
                  ))}
                  {ch.subtopics.length > 3 && (
                    <li className="planned-item-more">
                      +{ch.subtopics.length - 3} bagian simulasi/kuis lainnya
                    </li>
                  )}
                </ul>
              </div>

              {/* Footer Kartu Terkunci */}
              <div className="locked-card-footer">
                <div className="lock-reason">
                  <Clock size={14} className="lock-icon" />
                  <span>{ch.statusLabel}</span>
                </div>
                <div className="milestone-tag">
                  <Calendar size={12} />
                  <span>{ch.milestonePhase}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info banner kepatuhan roadmap PRD */}
        <div className="roadmap-notice-banner">
          <AlertCircle size={20} className="notice-icon" />
          <div className="notice-text">
            <strong>Fokus Belajar Saat Ini:</strong> Anda saat ini berada pada tahap Modul 1 (Konsep Dasar Elektrokimia).
            Simulator rangkaian (Bab 2), laboratorium virtual lelehan/larutan (Bab 3), serta kalkulator kuantitatif Faraday (Bab 4)
            akan aktif secara bertahap tanpa memerlukan registrasi akun atau langganan berbayar.
          </div>
        </div>
      </div>
    </section>
  );
};
