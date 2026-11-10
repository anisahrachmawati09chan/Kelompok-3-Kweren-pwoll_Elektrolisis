import React, { useState } from 'react';
import { CHAPTERS_DATA } from '../../data/courseData';
import {
  BookOpen,
  Lock,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Award,
  Zap,
  Activity,
  FlaskConical,
  Calculator,
  Star,
  ArrowRight,
  Info,
  AlertTriangle,
  Lightbulb,
  Target,
  Layers,
} from 'lucide-react';

interface ModulesPageProps {
  onOpenStudySheet: (subtopicId: string) => void;
  onLockedClick: (title: string) => void;
}

/**
 * ModulesPage: Halaman "Modul Belajar" lengkap pada menu sidebar.
 * Menampilkan:
 * 1. Header pengantar modul dengan statistik kursus
 * 2. Daftar bab yang dapat di-expand (accordion) beserta subtopik dan materi
 * 3. Konten materi Elektrolisis langsung di dalam accordion
 * 4. Tombol aksi untuk memulai belajar / membuka LabSheetModal
 */
export const ModulesPage: React.FC<ModulesPageProps> = ({
  onOpenStudySheet,
  onLockedClick,
}) => {
  // State accordion bab mana yang terbuka
  const [expandedChapter, setExpandedChapter] = useState<number | null>(1);
  // State subtab materi yang aktif dalam accordion
  const [activeSubtab, setActiveSubtab] = useState<string>('overview');

  const toggleChapter = (chapterId: number) => {
    setExpandedChapter((prev) => (prev === chapterId ? null : chapterId));
    setActiveSubtab('overview');
  };

  const iconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
    Zap,
    Activity,
    FlaskConical,
    Calculator,
    Award,
  };

  return (
    <div className="modules-page">
      {/* ========================================================
          HEADER HALAMAN MODUL BELAJAR
      ======================================================== */}
      <div className="modules-page-header">
        <div className="modules-header-content">
          <div className="modules-header-left">
            <span className="modules-kicker">KIMIA SMA KELAS XII • FASE F KURIKULUM MERDEKA</span>
            <h1 className="modules-main-title">Modul Belajar Elektrolisis</h1>
            <p className="modules-subtitle">
              Panduan belajar terstruktur dan interaktif untuk memahami sel elektrolisis
              dari konsep dasar redoks hingga penerapan industri penyepuhan logam.
            </p>
          </div>
          <div className="modules-header-stats">
            <div className="stat-pill">
              <Layers size={16} />
              <span><strong>5</strong> Bab</span>
            </div>
            <div className="stat-pill">
              <Clock size={16} />
              <span><strong>~3.5</strong> Jam</span>
            </div>
            <div className="stat-pill">
              <Star size={16} />
              <span><strong>5</strong> Lencana</span>
            </div>
            <div className="stat-pill">
              <Target size={16} />
              <span>Fase F</span>
            </div>
          </div>
        </div>

        {/* Banner info cara penggunaan */}
        <div className="modules-howto-banner">
          <Info size={18} className="howto-icon" />
          <div className="howto-text">
            <strong>Cara Menggunakan Modul Ini:</strong>{' '}
            Klik pada bab untuk membuka daftar materi. Klik subtopik atau tombol
            <em> "Mulai Belajar"</em> untuk membuka Lembar Kerja Laboratorium interaktif.
            Selesaikan Bab 1 dahulu untuk membuka bab selanjutnya.
          </div>
        </div>
      </div>

      {/* ========================================================
          DAFTAR BAB — ACCORDION
      ======================================================== */}
      <div className="modules-chapters-list">
        {CHAPTERS_DATA.map((chapter) => {
          const ChapterIcon = iconMap[chapter.iconName] || BookOpen;
          const isOpen = expandedChapter === chapter.id;
          const isLocked = chapter.status === 'prerequisite_locked';

          return (
            <div
              key={chapter.id}
              className={`chapter-accordion ${isOpen ? 'is-open' : ''} ${isLocked ? 'is-locked' : 'is-available'}`}
              style={{ '--chapter-color': chapter.color, '--chapter-accent': chapter.accentColor } as React.CSSProperties}
            >
              {/* ---- Header Accordion (klik untuk expand/collapse) ---- */}
              <button
                type="button"
                className="chapter-accordion-header"
                onClick={() => {
                  if (isLocked) {
                    onLockedClick(chapter.title);
                  } else {
                    toggleChapter(chapter.id);
                  }
                }}
                aria-expanded={isOpen}
              >
                <div className="ch-header-left">
                  <div
                    className="ch-icon-circle"
                    style={{ background: chapter.accentColor, color: chapter.color }}
                  >
                    {isLocked ? <Lock size={18} /> : <ChapterIcon size={18} />}
                  </div>
                  <div className="ch-title-group">
                    <div className="ch-label-row">
                      <span className="ch-number-pill">Bab {chapter.chapterNumber}</span>
                      <span
                        className={`ch-status-badge ${isLocked ? 'status-locked' : 'status-open'}`}
                      >
                        {isLocked ? (
                          <>
                            <Lock size={10} /> Terkunci
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={10} /> Tersedia
                          </>
                        )}
                      </span>
                    </div>
                    <h3 className="ch-title">{chapter.title}</h3>
                    <p className="ch-tagline">{chapter.tagline}</p>
                  </div>
                </div>

                <div className="ch-header-right">
                  <div className="ch-meta-col">
                    <span className="ch-subtopic-count">
                      {chapter.subtopics.length} bagian
                    </span>
                    <span className="ch-milestone">{chapter.milestonePhase}</span>
                  </div>
                  <div className="ch-chevron">
                    {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </div>
                </div>
              </button>

              {/* ---- Body Accordion (konten materi) ---- */}
              {isOpen && !isLocked && (
                <div className="chapter-accordion-body">
                  {/* Sub-tabs navigasi dalam bab */}
                  <div className="chapter-subtabs">
                    <button
                      type="button"
                      className={`subtab-btn ${activeSubtab === 'overview' ? 'active' : ''}`}
                      onClick={() => setActiveSubtab('overview')}
                    >
                      Ringkasan Bab
                    </button>
                    <button
                      type="button"
                      className={`subtab-btn ${activeSubtab === 'content' ? 'active' : ''}`}
                      onClick={() => setActiveSubtab('content')}
                    >
                      Materi Lengkap
                    </button>
                    <button
                      type="button"
                      className={`subtab-btn ${activeSubtab === 'subtopics' ? 'active' : ''}`}
                      onClick={() => setActiveSubtab('subtopics')}
                    >
                      Daftar Subtopik
                    </button>
                  </div>

                  {/* ---- SUBTAB: Ringkasan Bab ---- */}
                  {activeSubtab === 'overview' && (
                    <div className="subtab-panel">
                      <div className="overview-two-col">
                        {/* Deskripsi & Kompetensi */}
                        <div className="overview-left">
                          <div className="overview-desc-box">
                            <h4 className="overview-box-title">
                              <BookOpen size={16} /> Deskripsi Bab
                            </h4>
                            <p>{chapter.description}</p>
                          </div>

                          <div className="overview-comp-box">
                            <h4 className="overview-box-title">
                              <Target size={16} /> Kompetensi yang Dicapai
                            </h4>
                            <ul className="comp-checklist">
                              {chapter.competencies.map((comp, idx) => (
                                <li key={idx} className="comp-check-item">
                                  <CheckCircle2 size={15} className="comp-check-icon" />
                                  <span>{comp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Badge & Aksi */}
                        <div className="overview-right">
                          <div className="badge-preview-card" style={{ borderColor: chapter.color }}>
                            <Award size={32} style={{ color: chapter.color }} />
                            <h4 className="badge-preview-name">{chapter.badgeName}</h4>
                            <p className="badge-preview-desc">{chapter.badgeDescription}</p>
                          </div>

                          <div className="chapter-subtopic-quick">
                            <span className="quick-label">Bagian dalam bab ini:</span>
                            {chapter.subtopics.map((sub) => (
                              <div key={sub.id} className="quick-sub-row">
                                <span className="quick-sub-id">{sub.id}</span>
                                <span className="quick-sub-title">{sub.title}</span>
                                <span className="quick-sub-dur">{sub.duration}</span>
                              </div>
                            ))}
                          </div>

                          <button
                            type="button"
                            className="btn-start-chapter"
                            style={{ background: chapter.color }}
                            onClick={() => onOpenStudySheet(chapter.subtopics[0]?.id ?? '1.1')}
                          >
                            <span>Mulai Belajar Bab {chapter.chapterNumber}</span>
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ---- SUBTAB: Materi Lengkap ---- */}
                  {activeSubtab === 'content' && chapter.id === 1 && (
                    <div className="subtab-panel">
                      <ChapterOneContent onOpenStudySheet={onOpenStudySheet} />
                    </div>
                  )}
                  {activeSubtab === 'content' && chapter.id === 2 && (
                    <div className="subtab-panel">
                      <ChapterTwoContent />
                    </div>
                  )}
                  {activeSubtab === 'content' && chapter.id === 3 && (
                    <div className="subtab-panel">
                      <ChapterThreeContent />
                    </div>
                  )}
                  {activeSubtab === 'content' && chapter.id === 4 && (
                    <div className="subtab-panel">
                      <ChapterFourContent />
                    </div>
                  )}
                  {activeSubtab === 'content' && chapter.id === 5 && (
                    <div className="subtab-panel">
                      <ChapterFiveContent />
                    </div>
                  )}

                  {/* ---- SUBTAB: Daftar Subtopik ---- */}
                  {activeSubtab === 'subtopics' && (
                    <div className="subtab-panel">
                      <div className="subtopics-list-view">
                        {chapter.subtopics.map((sub, idx) => (
                          <div key={sub.id} className="sub-list-item">
                            <div className="sub-list-num">{idx + 1}</div>
                            <div className="sub-list-info">
                              <h4 className="sub-list-title">{sub.title}</h4>
                              <p className="sub-list-desc">{sub.description}</p>
                              {sub.keyFormula && (
                                <div className="sub-list-formula">
                                  <span className="formula-chip">{sub.keyFormula}</span>
                                </div>
                              )}
                            </div>
                            <div className="sub-list-meta">
                              <span className="sub-dur-tag">
                                <Clock size={12} /> {sub.duration}
                              </span>
                              <span className={`sub-type-tag type-${sub.type}`}>
                                {sub.type}
                              </span>
                              <button
                                type="button"
                                className="sub-open-btn"
                                onClick={() => onOpenStudySheet(sub.id)}
                                style={{ borderColor: chapter.color, color: chapter.color }}
                              >
                                Buka <ArrowRight size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Pesan terkunci */}
              {isOpen && isLocked && (
                <div className="chapter-locked-body">
                  <Lock size={24} className="locked-body-icon" />
                  <p>
                    Bab ini terkunci. Selesaikan <strong>Bab {chapter.id - 1}</strong> terlebih
                    dahulu untuk membuka akses materi ini.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================
   KONTEN MATERI BAB 1: DASAR ELEKTROKIMIA
   Sumber: Materi Kimia Kelas XII - Elektrolisis
============================================================ */
const ChapterOneContent: React.FC<{ onOpenStudySheet: (id: string) => void }> = ({
  onOpenStudySheet,
}) => (
  <div className="chapter-material">
    {/* ---- A. Pengertian Elektrolisis ---- */}
    <section className="material-section">
      <div className="material-section-header">
        <span className="material-section-num">A</span>
        <h3>Pengertian Elektrolisis</h3>
      </div>
      <p className="material-para">
        <strong>Elektrolisis</strong> adalah proses penguraian suatu elektrolit oleh arus listrik
        searah (DC). Dalam proses ini, energi listrik diubah menjadi energi kimia untuk
        melangsungkan reaksi yang <em>tidak spontan</em>.
      </p>
      <div className="material-defbox">
        <Lightbulb size={18} className="defbox-icon" />
        <div>
          <strong>Definisi Kunci:</strong> Sel elektrolisis adalah sel elektrokimia di mana
          energi listrik dari sumber arus DC digunakan untuk menghasilkan reaksi kimia
          non-spontan pada elektroda-elektrodanya.
        </div>
      </div>
    </section>

    {/* ---- B. Reaksi Oksidasi dan Reduksi ---- */}
    <section className="material-section">
      <div className="material-section-header">
        <span className="material-section-num">B</span>
        <h3>Reaksi Oksidasi dan Reduksi (REDOKS)</h3>
      </div>
      <p className="material-para">
        Dasar sel elektrolisis adalah reaksi transfer elektron. Dua jenis setengah reaksi yang
        terjadi:
      </p>
      <div className="dual-reaction-grid">
        <div className="reaction-box katode-box">
          <div className="reaction-box-label">REDUKSI — Di Katode (−)</div>
          <p>Spesies kimia <strong>menerima</strong> elektron, bilangan oksidasi <strong>turun</strong>.</p>
          <div className="reaction-equation-block">
            <div className="eq-row">
              <span className="eq-left">Cu²⁺(aq) + 2e⁻</span>
              <span className="eq-arrow">→</span>
              <span className="eq-right">Cu(s)</span>
            </div>
            <div className="eq-row">
              <span className="eq-left">2H⁺(aq) + 2e⁻</span>
              <span className="eq-arrow">→</span>
              <span className="eq-right">H₂(g)</span>
            </div>
            <div className="eq-row">
              <span className="eq-left">2H₂O(l) + 2e⁻</span>
              <span className="eq-arrow">→</span>
              <span className="eq-right">H₂(g) + 2OH⁻(aq)</span>
            </div>
          </div>
        </div>
        <div className="reaction-box anode-box">
          <div className="reaction-box-label">OKSIDASI — Di Anode (+)</div>
          <p>Spesies kimia <strong>melepaskan</strong> elektron, bilangan oksidasi <strong>naik</strong>.</p>
          <div className="reaction-equation-block">
            <div className="eq-row">
              <span className="eq-left">2Cl⁻(aq)</span>
              <span className="eq-arrow">→</span>
              <span className="eq-right">Cl₂(g) + 2e⁻</span>
            </div>
            <div className="eq-row">
              <span className="eq-left">2H₂O(l)</span>
              <span className="eq-arrow">→</span>
              <span className="eq-right">O₂(g) + 4H⁺(aq) + 4e⁻</span>
            </div>
            <div className="eq-row">
              <span className="eq-left">Cu(s)</span>
              <span className="eq-arrow">→</span>
              <span className="eq-right">Cu²⁺(aq) + 2e⁻</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mnemonic-box">
        <strong>🔑 Mnemonik "KRAO":</strong>
        &nbsp;<strong>K</strong>atode = <strong>R</strong>eduksi &nbsp;•&nbsp;
        <strong>A</strong>node = <strong>O</strong>ksidasi
        <br />
        <strong>🔑 Mnemonik "PANIC":</strong>
        &nbsp;<strong>P</strong>ositive <strong>A</strong>node, <strong>N</strong>egative <strong>I</strong>s <strong>C</strong>athode
      </div>
    </section>

    {/* ---- C. Sel Volta vs Sel Elektrolisis ---- */}
    <section className="material-section">
      <div className="material-section-header">
        <span className="material-section-num">C</span>
        <h3>Perbandingan Sel Volta vs Sel Elektrolisis</h3>
      </div>
      <div className="comparison-table-wrap">
        <table className="material-compare-table">
          <thead>
            <tr>
              <th>Aspek</th>
              <th>Sel Volta (Galvani)</th>
              <th className="highlighted-col">Sel Elektrolisis</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Perubahan Energi</td>
              <td>Kimia → Listrik</td>
              <td className="highlighted-col">Listrik → Kimia</td>
            </tr>
            <tr>
              <td>Spontanitas Reaksi</td>
              <td>Spontan</td>
              <td className="highlighted-col">Tidak Spontan (butuh arus DC)</td>
            </tr>
            <tr>
              <td>Kutub Katode</td>
              <td>Positif (+)</td>
              <td className="highlighted-col katode-hl">Negatif (−)</td>
            </tr>
            <tr>
              <td>Kutub Anode</td>
              <td>Negatif (−)</td>
              <td className="highlighted-col anode-hl">Positif (+)</td>
            </tr>
            <tr>
              <td>Reaksi di Katode</td>
              <td>Reduksi</td>
              <td className="highlighted-col">Reduksi</td>
            </tr>
            <tr>
              <td>Reaksi di Anode</td>
              <td>Oksidasi</td>
              <td className="highlighted-col">Oksidasi</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    {/* ---- D. Komponen Utama ---- */}
    <section className="material-section">
      <div className="material-section-header">
        <span className="material-section-num">D</span>
        <h3>Komponen Utama Sel Elektrolisis</h3>
      </div>
      <div className="components-grid">
        {[
          {
            num: '1',
            title: 'Sumber Arus DC',
            desc: 'Baterai atau catu daya DC yang memompa elektron. Kutub (−) → Katode; Kutub (+) → Anode.',
            color: '#7c3aed',
          },
          {
            num: '2',
            title: 'Katode (Elektroda −)',
            desc: 'Elektroda terhubung kutub negatif. Kation (ion +) bermigrasi ke sini dan mengalami reduksi.',
            color: '#2563eb',
          },
          {
            num: '3',
            title: 'Anode (Elektroda +)',
            desc: 'Elektroda terhubung kutub positif. Anion (ion −) bermigrasi ke sini dan mengalami oksidasi.',
            color: '#dc2626',
          },
          {
            num: '4',
            title: 'Elektrolit',
            desc: 'Larutan atau lelehan berion bebas. Kation bergerak ke katode, anion ke anode. Elektron tidak mengalir dalam cairan!',
            color: '#059669',
          },
        ].map((comp) => (
          <div key={comp.num} className="component-mat-card" style={{ borderTopColor: comp.color }}>
            <div className="comp-num-badge" style={{ background: comp.color }}>
              {comp.num}
            </div>
            <h4 className="comp-mat-title">{comp.title}</h4>
            <p className="comp-mat-desc">{comp.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* CTA ke LabSheet */}
    <div className="material-cta-box">
      <Zap size={20} className="cta-icon" />
      <div>
        <strong>Latihan Interaktif Tersedia!</strong>
        <p>Buka Lembar Kerja Siswa untuk latihan soal, tabel komparasi, dan cek pemahaman langsung.</p>
      </div>
      <button
        type="button"
        className="btn-open-lab"
        onClick={() => onOpenStudySheet('1.1')}
      >
        Buka Lembar Kerja <ArrowRight size={14} />
      </button>
    </div>
  </div>
);

/* ============================================================
   KONTEN MATERI BAB 2: CARA KERJA SEL ELEKTROLISIS
============================================================ */
const ChapterTwoContent: React.FC = () => (
  <div className="chapter-material">
    <section className="material-section">
      <div className="material-section-header">
        <span className="material-section-num">A</span>
        <h3>Sumber Arus Searah (DC) dan Rangkaian</h3>
      </div>
      <p className="material-para">
        Sel elektrolisis memerlukan sumber arus searah (Direct Current / DC) seperti baterai
        atau adaptor DC untuk mendorong elektron mengalir menuju elektroda.
      </p>
      <div className="material-infobox">
        <AlertTriangle size={16} className="info-icon amber" />
        <span>
          Arus bolak-balik (AC) <strong>tidak dapat</strong> digunakan untuk elektrolisis karena
          arah aliran elektron berubah-ubah setiap saat.
        </span>
      </div>
    </section>

    <section className="material-section">
      <div className="material-section-header">
        <span className="material-section-num">B</span>
        <h3>Aliran Elektron dan Migrasi Ion</h3>
      </div>
      <div className="flow-diagram">
        <div className="flow-step">
          <div className="flow-node battery-node">Baterai (−)</div>
          <div className="flow-arrow">→ elektron →</div>
          <div className="flow-node katode-node">Katode (−)</div>
        </div>
        <div className="flow-sep">Di dalam larutan: ion bermigrasi</div>
        <div className="flow-step">
          <div className="flow-node katode-node">Kation (+)</div>
          <div className="flow-arrow">→ menuju →</div>
          <div className="flow-node katode-node">Katode</div>
        </div>
        <div className="flow-step">
          <div className="flow-node anode-node">Anion (−)</div>
          <div className="flow-arrow">→ menuju →</div>
          <div className="flow-node anode-node">Anode (+)</div>
        </div>
      </div>
      <div className="material-defbox">
        <Lightbulb size={16} className="defbox-icon" />
        <span>
          <strong>Penting!</strong> Elektron <em>hanya</em> mengalir melalui kawat (sirkuit luar).
          Di dalam larutan, muatan dihantarkan oleh <strong>pergerakan ion</strong>, bukan elektron bebas.
        </span>
      </div>
    </section>

    <section className="material-section">
      <div className="material-section-header">
        <span className="material-section-num">C</span>
        <h3>Ringkasan Arah Aliran</h3>
      </div>
      <div className="material-compare-table-wrap">
        <table className="material-compare-table">
          <thead>
            <tr>
              <th>Jalur</th>
              <th>Media</th>
              <th>Pembawa Muatan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Kawat luar (sirkuit eksternal)</td>
              <td>Kawat konduktor</td>
              <td><strong>Elektron (e⁻)</strong></td>
            </tr>
            <tr>
              <td>Di dalam larutan/lelehan</td>
              <td>Elektrolit</td>
              <td><strong>Ion (kation &amp; anion)</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
);

/* ============================================================
   KONTEN MATERI BAB 3: PREDIKSI REAKSI & PRODUK
============================================================ */
const ChapterThreeContent: React.FC = () => (
  <div className="chapter-material">
    <section className="material-section">
      <div className="material-section-header">
        <span className="material-section-num">A</span>
        <h3>Elektrolisis Lelehan (Tanpa Air)</h3>
      </div>
      <p className="material-para">
        Pada elektrolisis <strong>lelehan</strong> garam murni (mis. NaCl cair), tidak ada air.
        Hanya ion-ion dari garam yang bereaksi pada elektroda.
      </p>
      <div className="example-box">
        <div className="example-label">Contoh: Elektrolisis Lelehan NaCl</div>
        <div className="reaction-equation-block">
          <p className="eq-note">Lelehan NaCl: Na⁺ dan Cl⁻ bebas bergerak</p>
          <div className="eq-row katode-eq">
            <span className="eq-side">Katode (−):</span>
            <span className="eq-left">Na⁺(l) + e⁻</span>
            <span className="eq-arrow">→</span>
            <span className="eq-right">Na(l)</span>
          </div>
          <div className="eq-row anode-eq">
            <span className="eq-side">Anode (+):</span>
            <span className="eq-left">2Cl⁻(l)</span>
            <span className="eq-arrow">→</span>
            <span className="eq-right">Cl₂(g) + 2e⁻</span>
          </div>
          <div className="eq-row total-eq">
            <span className="eq-side">Total:</span>
            <span className="eq-left">2NaCl(l)</span>
            <span className="eq-arrow">→</span>
            <span className="eq-right">2Na(l) + Cl₂(g)</span>
          </div>
        </div>
        <p className="example-note">⚡ Ini adalah prinsip proses Down untuk produksi Na logam industri!</p>
      </div>
    </section>

    <section className="material-section">
      <div className="material-section-header">
        <span className="material-section-num">B</span>
        <h3>Elektrolisis Larutan Berair — Elektroda Inert (Pt/C)</h3>
      </div>
      <p className="material-para">
        Ketika elektrolit dilarutkan dalam air, terjadi kompetisi antara ion larutan dengan
        molekul air (H₂O). Aturan prioritas membantu menentukan spesies mana yang bereaksi:
      </p>
      <div className="priority-rules">
        <div className="priority-card katode-priority">
          <h4>🔵 Prioritas Reduksi di Katode</h4>
          <ol className="priority-list">
            <li>Ion logam dengan E°red &gt; −0,83 V (lebih mudah tereduksi dari H₂O) → <strong>Ion logam yang tereduksi</strong></li>
            <li>H⁺ dari asam kuat</li>
            <li>H₂O jika kation logam aktif (seperti Na⁺, K⁺, Ca²⁺)</li>
          </ol>
        </div>
        <div className="priority-card anode-priority">
          <h4>🔴 Prioritas Oksidasi di Anode</h4>
          <ol className="priority-list">
            <li>Anion halida (Cl⁻, Br⁻, I⁻) selain F⁻ → <strong>Gas halogen</strong></li>
            <li>OH⁻ dari basa</li>
            <li>H₂O jika anion oksianion (SO₄²⁻, NO₃⁻, PO₄³⁻)</li>
          </ol>
        </div>
      </div>

      <div className="example-box">
        <div className="example-label">Contoh: Elektrolisis Larutan NaCl (aq) — Elektroda Pt</div>
        <div className="reaction-equation-block">
          <p className="eq-note">Di katode, air (H₂O) tereduksi karena Na⁺ adalah logam aktif:</p>
          <div className="eq-row katode-eq">
            <span className="eq-side">Katode:</span>
            <span className="eq-left">2H₂O(l) + 2e⁻</span>
            <span className="eq-arrow">→</span>
            <span className="eq-right">H₂(g) + 2OH⁻(aq)</span>
          </div>
          <div className="eq-row anode-eq">
            <span className="eq-side">Anode:</span>
            <span className="eq-left">2Cl⁻(aq)</span>
            <span className="eq-arrow">→</span>
            <span className="eq-right">Cl₂(g) + 2e⁻</span>
          </div>
        </div>
      </div>
    </section>

    <section className="material-section">
      <div className="material-section-header">
        <span className="material-section-num">C</span>
        <h3>Elektrolisis dengan Elektroda Aktif</h3>
      </div>
      <p className="material-para">
        Jika anode terbuat dari logam yang dapat larut (elektroda aktif, seperti Cu), maka
        logam anode itu sendiri yang teroksidasi — bukan anion larutan.
      </p>
      <div className="example-box">
        <div className="example-label">Contoh: Elektrolisis CuSO₄(aq) — Anode Cu (aktif)</div>
        <div className="reaction-equation-block">
          <div className="eq-row katode-eq">
            <span className="eq-side">Katode:</span>
            <span className="eq-left">Cu²⁺(aq) + 2e⁻</span>
            <span className="eq-arrow">→</span>
            <span className="eq-right">Cu(s) ↓</span>
          </div>
          <div className="eq-row anode-eq">
            <span className="eq-side">Anode Cu:</span>
            <span className="eq-left">Cu(s)</span>
            <span className="eq-arrow">→</span>
            <span className="eq-right">Cu²⁺(aq) + 2e⁻</span>
          </div>
        </div>
        <p className="example-note">
          ✅ Prinsip ini digunakan dalam <strong>penyepuhan logam</strong> dan <strong>pemurnian tembaga</strong>!
        </p>
      </div>
    </section>
  </div>
);

/* ============================================================
   KONTEN MATERI BAB 4: HUKUM FARADAY
============================================================ */
const ChapterFourContent: React.FC = () => (
  <div className="chapter-material">
    <section className="material-section">
      <div className="material-section-header">
        <span className="material-section-num">A</span>
        <h3>Hukum Faraday I — Hubungan Massa dan Muatan</h3>
      </div>
      <div className="material-defbox">
        <Lightbulb size={18} className="defbox-icon" />
        <div>
          <strong>Hukum Faraday I:</strong> Massa zat yang diendapkan atau dilarutkan pada
          elektroda <em>berbanding lurus</em> dengan jumlah muatan listrik yang digunakan.
        </div>
      </div>

      <div className="formula-showcase">
        <div className="formula-card primary-formula">
          <div className="formula-label">Muatan Listrik (Q)</div>
          <div className="formula-eq">Q = I × t</div>
          <div className="formula-vars">
            I = arus (Ampere) &nbsp;•&nbsp; t = waktu (sekon) &nbsp;•&nbsp; Q = muatan (Coulomb)
          </div>
        </div>
        <div className="formula-card secondary-formula">
          <div className="formula-label">Mol Elektron</div>
          <div className="formula-eq">n(e⁻) = Q / F</div>
          <div className="formula-vars">
            F = Tetapan Faraday = <strong>96.485 C/mol</strong>
          </div>
        </div>
        <div className="formula-card main-formula">
          <div className="formula-label">Massa Endapan (m)</div>
          <div className="formula-eq">m = (M × I × t) / (z × F)</div>
          <div className="formula-vars">
            M = massa molar (g/mol) &nbsp;•&nbsp; z = jumlah elektron yang terlibat
          </div>
        </div>
      </div>
    </section>

    <section className="material-section">
      <div className="material-section-header">
        <span className="material-section-num">B</span>
        <h3>Hukum Faraday II — Hubungan Massa Ekivalen</h3>
      </div>
      <div className="material-defbox">
        <Lightbulb size={18} className="defbox-icon" />
        <div>
          <strong>Hukum Faraday II:</strong> Jika beberapa sel elektrolisis dihubungkan seri,
          massa zat yang dihasilkan pada masing-masing elektroda sebanding dengan massa
          ekivalennya (Mr / z).
        </div>
      </div>
      <div className="formula-showcase">
        <div className="formula-card primary-formula">
          <div className="formula-label">Perbandingan Massa</div>
          <div className="formula-eq">m₁/m₂ = (M₁/z₁) / (M₂/z₂)</div>
          <div className="formula-vars">z = valensi elektrokimia (jumlah elektron per ion)</div>
        </div>
      </div>
    </section>

    <section className="material-section">
      <div className="material-section-header">
        <span className="material-section-num">C</span>
        <h3>Contoh Soal Hukum Faraday</h3>
      </div>
      <div className="example-box">
        <div className="example-label">Contoh Soal 1</div>
        <p className="example-question">
          Arus listrik 2 A dialirkan selama 30 menit melalui larutan CuSO₄. Hitung massa
          tembaga (Cu) yang mengendap di katode! (Ar Cu = 63,5; z = 2; F = 96.500 C/mol)
        </p>
        <div className="solution-steps">
          <div className="step">
            <span className="step-num">1</span>
            <div>
              <strong>Hitung muatan (Q):</strong>
              <div className="step-eq">Q = I × t = 2 A × (30 × 60 s) = 2 × 1800 = 3.600 C</div>
            </div>
          </div>
          <div className="step">
            <span className="step-num">2</span>
            <div>
              <strong>Hitung mol elektron:</strong>
              <div className="step-eq">n(e⁻) = Q / F = 3.600 / 96.500 = 0,0373 mol</div>
            </div>
          </div>
          <div className="step">
            <span className="step-num">3</span>
            <div>
              <strong>Hitung massa Cu:</strong>
              <div className="step-eq">m = (M × Q) / (z × F) = (63,5 × 3.600) / (2 × 96.500)</div>
              <div className="step-eq step-answer">m = 228.600 / 193.000 = <strong>1,185 gram Cu</strong></div>
            </div>
          </div>
        </div>
      </div>

      <div className="example-box">
        <div className="example-label">Contoh Soal 2</div>
        <p className="example-question">
          Arus 5 A dialirkan ke larutan AgNO₃ selama 1 jam. Hitung massa perak yang
          mengendap! (Ar Ag = 108; z = 1; F = 96.500 C/mol)
        </p>
        <div className="solution-steps">
          <div className="step">
            <span className="step-num">1</span>
            <div>
              <strong>Q = I × t</strong>
              <div className="step-eq">= 5 × 3.600 = 18.000 C</div>
            </div>
          </div>
          <div className="step">
            <span className="step-num">2</span>
            <div>
              <strong>Massa Ag:</strong>
              <div className="step-eq">m = (108 × 18.000) / (1 × 96.500)</div>
              <div className="step-eq step-answer">= 1.944.000 / 96.500 = <strong>20,15 gram Ag</strong></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

/* ============================================================
   KONTEN MATERI BAB 5: PENERAPAN INDUSTRI
============================================================ */
const ChapterFiveContent: React.FC = () => (
  <div className="chapter-material">
    <section className="material-section">
      <div className="material-section-header">
        <span className="material-section-num">A</span>
        <h3>Penyepuhan Logam (Electroplating)</h3>
      </div>
      <p className="material-para">
        Penyepuhan atau pelapisan logam adalah aplikasi industri paling umum dari elektrolisis.
        Bertujuan melindungi logam dari korosi, meningkatkan tampilan estetika, atau
        menambahkan sifat khusus (konduktivitas, kekerasan).
      </p>
      <div className="application-setup">
        <div className="setup-katode">
          <strong>Katode (−)</strong>
          <p>Benda yang ingin disepuh (mis. perhiasan, pelek)</p>
        </div>
        <div className="setup-middle">
          <div className="setup-bath">Larutan elektrolit (mis. CuSO₄ untuk penyepuhan Cu)</div>
        </div>
        <div className="setup-anode">
          <strong>Anode (+)</strong>
          <p>Logam pelapis (mis. batang Cu murni)</p>
        </div>
      </div>
      <div className="application-steps">
        <div className="app-step">
          <span className="app-step-num">1</span>
          Arus DC dialirkan → elektron mengalir dari baterai ke katode
        </div>
        <div className="app-step">
          <span className="app-step-num">2</span>
          Anode Cu teroksidasi: Cu → Cu²⁺ + 2e⁻ (anode larut ke larutan)
        </div>
        <div className="app-step">
          <span className="app-step-num">3</span>
          Ion Cu²⁺ bermigrasi ke katode → tereduksi: Cu²⁺ + 2e⁻ → Cu (endapan di benda)
        </div>
        <div className="app-step">
          <span className="app-step-num">4</span>
          Ketebalan lapisan diatur dengan mengendalikan arus (I) dan waktu (t)
        </div>
      </div>
    </section>

    <section className="material-section">
      <div className="material-section-header">
        <span className="material-section-num">B</span>
        <h3>Pemurnian Logam (Electrorefining)</h3>
      </div>
      <p className="material-para">
        Pemurnian tembaga industri (blister copper → tembaga murni 99,99%) menggunakan
        prinsip elektrolisis serupa:
      </p>
      <div className="compare-two-col">
        <div className="col-card katode-col-card">
          <strong>Katode</strong>
          <p>Tembaga murni tipis (starter sheet Cu)</p>
          <p className="col-reaction">Cu²⁺(aq) + 2e⁻ → Cu(s) ✓</p>
          <p className="col-note">Tembaga murni menempel dan tebal</p>
        </div>
        <div className="col-card anode-col-card">
          <strong>Anode</strong>
          <p>Blister copper (Cu kasar + impuritas)</p>
          <p className="col-reaction">Cu(s) → Cu²⁺(aq) + 2e⁻</p>
          <p className="col-note">Cu larut; impuritas (Au, Ag, Pb) jatuh sebagai lumpur anode</p>
        </div>
      </div>
    </section>

    <section className="material-section">
      <div className="material-section-header">
        <span className="material-section-num">C</span>
        <h3>Produksi Zat Kimia Industri melalui Elektrolisis</h3>
      </div>
      <div className="industry-table-wrap">
        <table className="material-compare-table">
          <thead>
            <tr>
              <th>Proses Industri</th>
              <th>Bahan Baku</th>
              <th>Produk Katode</th>
              <th>Produk Anode</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Proses Down (Dow)</td>
              <td>Lelehan NaCl</td>
              <td>Na(l) logam</td>
              <td>Cl₂(g)</td>
            </tr>
            <tr>
              <td>Proses Klor-Alkali</td>
              <td>Larutan NaCl</td>
              <td>H₂(g) + NaOH</td>
              <td>Cl₂(g)</td>
            </tr>
            <tr>
              <td>Pemurnian Al (Hall-Héroult)</td>
              <td>Lelehan Al₂O₃ dalam Kriolit</td>
              <td>Al(l)</td>
              <td>CO₂(g)</td>
            </tr>
            <tr>
              <td>Pemurnian Cu</td>
              <td>Larutan CuSO₄</td>
              <td>Cu murni (s)</td>
              <td>Cu kasar larut</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
);

