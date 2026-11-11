import React, { useState } from 'react';
import { X, ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, BookOpen, GraduationCap } from 'lucide-react';
import { FormulaRenderer } from '../../components/chemistry/FormulaRenderer';
import { ReactionEquation } from '../../components/chemistry/ReactionEquation';

interface LabSheetModalProps {
  initialSubtopicId?: string;
  onClose: () => void;
  onAskTeacher?: (topicTitle: string) => void;
}

/**
 * LabSheetModal: Lembar Belajar Laboratorium Mandiri Modul 1.
 * Memberikan ruang rumus yang lapang, hierarki konsep yang jelas, tabel perbandingan komparatif,
 * dan cek pemahaman tanpa memerlukan login atau identitas siswa.
 */
export const LabSheetModal: React.FC<LabSheetModalProps> = ({
  initialSubtopicId = '1.1',
  onClose,
  onAskTeacher,
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialSubtopicId);

  // State kuis pemahaman lokal sederhana (Level 1)
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);

  const tabs = [
    { id: '1.1', label: '1.1 Reaksi Redoks' },
    { id: '1.2', label: '1.2 Volta vs Elektrolisis' },
    { id: '1.3', label: '1.3 Komponen Sel' },
    { id: '1.4', label: '1.4 Cek Pemahaman' },
  ];

  return (
    <div className="lab-modal-backdrop" role="dialog" aria-modal="true">
      <div className="lab-modal-window">
        {/* Header Lembar Kerja */}
        <div className="lab-modal-header">
          <div className="modal-title-group">
            <div className="modal-badge-row">
              <span className="badge badge-primary">LEMBAR KERJA SISWA</span>
              <span className="badge badge-success">MODUL 1 AKTIF</span>
            </div>
            <h2 className="modal-main-title">Dasar Elektrokimia: Sel Elektrolisis</h2>
            <p className="modal-subtitle">Kimia SMA Kelas 12 • Fase F Kurikulum Merdeka</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {onAskTeacher && (
              <button
                type="button"
                className="topbar-teacher-pill-btn"
                onClick={() => {
                  const currentTab = tabs.find((t) => t.id === activeTab);
                  onAskTeacher(currentTab ? currentTab.label : 'Sel Elektrolisis');
                }}
                title="Tanya Guru Kimia tentang materi bagian ini"
              >
                <GraduationCap size={15} />
                <span>Tanya Guru</span>
              </button>
            )}

            <button
              type="button"
              className="btn-modal-close"
              onClick={onClose}
              aria-label="Tutup lembar belajar"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Navigasi Subtopik */}
        <div className="modal-tab-bar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`modal-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Konten Lembar Laboratorium */}
        <div className="lab-modal-scrollable-content">
          {/* BAGIAN 1.1: REAKSI REDOKS */}
          {activeTab === '1.1' && (
            <div className="lab-sheet-view">
              <div className="sheet-section-title">
                <span className="part-number">Bagian 1.1</span>
                <h3>Konsep Reaksi Oksidasi dan Reduksi</h3>
              </div>

              <p className="sheet-intro-p">
                Reaksi elektrokimia pada intinya adalah reaksi transfer elektron (reaksi redoks).
                Untuk menguasai sel elektrolisis, ingat selalu konsep dasar serah-terima elektron:
              </p>

              {/* Dua Kotak Konsep Berdampingan */}
              <div className="duo-concept-grid">
                <div className="duo-concept-card reduction-card">
                  <div className="duo-badge badge-katode">REDUKSI (Di Katode)</div>
                  <h4>Penerimaan Elektron</h4>
                  <p>
                    Spesies kimia menerima / menangkap elektron, sehingga bilangan oksidasi (biloks)
                    mengalami penurunan.
                  </p>
                  <div className="formula-highlight-area">
                    <span className="formula-label">Contoh Persamaan Setengah Reaksi:</span>
                    <ReactionEquation
                      type="reduction"
                      reactants="Cu2+ + 2e-"
                      products="Cu(s)"
                      conditionNote="Pengendapan tembaga"
                    />
                  </div>
                </div>

                <div className="duo-concept-card oxidation-card">
                  <div className="duo-badge badge-anode">OKSIDASI (Di Anode)</div>
                  <h4>Pelepasan Elektron</h4>
                  <p>
                    Spesies kimia melepaskan elektron, sehingga bilangan oksidasi (biloks)
                    mengalami kenaikan.
                  </p>
                  <div className="formula-highlight-area">
                    <span className="formula-label">Contoh Persamaan Setengah Reaksi:</span>
                    <ReactionEquation
                      type="oxidation"
                      reactants="2Cl-"
                      products="Cl2(g) + 2e-"
                      conditionNote="Pembentukan gas klorin"
                    />
                  </div>
                </div>
              </div>

              {/* Jembatan Keledai / Mnemonic */}
              <div className="mnemonic-callout">
                <div className="mnemonic-title">
                  <BookOpen size={18} />
                  <strong>Mnemonik Penting Kimia SMA: &quot;KRAO&quot;</strong>
                </div>
                <div className="mnemonic-content">
                  <span className="mnemonic-item"><strong>K - R:</strong> <strong>K</strong>atode tempat <strong>R</strong>eduksi</span>
                  <span className="mnemonic-divider">•</span>
                  <span className="mnemonic-item"><strong>A - O:</strong> <strong>A</strong>node tempat <strong>O</strong>ksidasi</span>
                </div>
                <p className="mnemonic-note">
                  Aturan ini berlaku <em>mutlak</em> baik pada Sel Volta maupun Sel Elektrolisis!
                </p>
              </div>

              {/* Navigasi Footer Tab */}
              <div className="modal-step-nav">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setActiveTab('1.2')}
                >
                  <span>Lanjut ke 1.2: Volta vs Elektrolisis</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* BAGIAN 1.2: VOLTA VS ELEKTROLISIS */}
          {activeTab === '1.2' && (
            <div className="lab-sheet-view">
              <div className="sheet-section-title">
                <span className="part-number">Bagian 1.2</span>
                <h3>Perbandingan Sel Volta vs Sel Elektrolisis</h3>
              </div>

              <p className="sheet-intro-p">
                Banyak siswa terkecoh karena polaritas elektroda pada sel elektrolisis berbeda dengan sel volta.
                Pelajari perbedaan fundamental pada tabel laboratorium berikut:
              </p>

              {/* Tabel Komparasi Akademis */}
              <div className="table-responsive-container">
                <table className="comparison-lab-table">
                  <thead>
                    <tr>
                      <th>Aspek Pembanding</th>
                      <th>Sel Volta (Galvani)</th>
                      <th>Sel Elektrolisis</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Perubahan Energi</strong></td>
                      <td>Energi Kimia → Energi Listrik</td>
                      <td className="highlight-cell">Energi Listrik → Reaksi Kimia</td>
                    </tr>
                    <tr>
                      <td><strong>Spontanitas Reaksi</strong></td>
                      <td>Spontan (menghasilkan arus listrik)</td>
                      <td className="highlight-cell">Tidak Spontan (perlu suplai arus DC)</td>
                    </tr>
                    <tr>
                      <td><strong>Kutub Katode</strong></td>
                      <td>Kutub Positif (+)</td>
                      <td className="highlight-cell katode-col">Kutub Negatif (-)</td>
                    </tr>
                    <tr>
                      <td><strong>Kutub Anode</strong></td>
                      <td>Kutub Negatif (-)</td>
                      <td className="highlight-cell anode-col">Kutub Positif (+)</td>
                    </tr>
                    <tr>
                      <td><strong>Reaksi di Katode</strong></td>
                      <td>Reduksi (menerima e⁻)</td>
                      <td>Reduksi (menerima e⁻)</td>
                    </tr>
                    <tr>
                      <td><strong>Reaksi di Anode</strong></td>
                      <td>Oksidasi (melepas e⁻)</td>
                      <td>Oksidasi (melepas e⁻)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Mnemonic PANIC untuk Sel Elektrolisis */}
              <div className="lab-tip-box">
                <AlertTriangle size={18} className="text-amber" />
                <div>
                  <strong>Cara Mudah Mengingat Polaritas Elektrolisis:</strong>
                  <br />
                  Ingat kata <strong>&quot;PANIC&quot;</strong>:
                  <strong> P</strong>ositive <strong>A</strong>node, <strong>N</strong>egative <strong>I</strong>s <strong>C</strong>athode!
                  (Anode = Positif, Katode = Negatif).
                </div>
              </div>

              {/* Navigasi Footer Tab */}
              <div className="modal-step-nav-split">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setActiveTab('1.1')}
                >
                  <ArrowLeft size={16} />
                  <span>Kembali ke 1.1</span>
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setActiveTab('1.3')}
                >
                  <span>Lanjut ke 1.3: Komponen Sel</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* BAGIAN 1.3: KOMPONEN UTAMA */}
          {activeTab === '1.3' && (
            <div className="lab-sheet-view">
              <div className="sheet-section-title">
                <span className="part-number">Bagian 1.3</span>
                <h3>Komponen Utama Sel Elektrolisis</h3>
              </div>

              <p className="sheet-intro-p">
                Sebuah bejana sel elektrolisis laboratorium standar tersusun atas 4 komponen utama berikut:
              </p>

              <div className="component-cards-stack">
                <div className="component-spec-card">
                  <div className="spec-index">1</div>
                  <div className="spec-details">
                    <h4>Sumber Arus Searah (DC Power Supply / Baterai)</h4>
                    <p>
                      Berfungsi sebagai &quot;pompa elektron&quot;. Kutub negatif baterai memompa elektron menuju katode,
                      sedangkan kutub positif baterai menarik elektron dari anode.
                    </p>
                  </div>
                </div>

                <div className="component-spec-card katode-accent">
                  <div className="spec-index katode-idx">2</div>
                  <div className="spec-details">
                    <h4>Katode (Elektroda Negatif)</h4>
                    <p>
                      Elektroda yang dihubungkan dengan kutub negatif sumber arus DC.
                      Kation (ion bermuatan positif, seperti <FormulaRenderer formula="Na+" />, <FormulaRenderer formula="Cu2+" />)
                      akan bergerak mendekat dan mengalami reduksi.
                    </p>
                  </div>
                </div>

                <div className="component-spec-card anode-accent">
                  <div className="spec-index anode-idx">3</div>
                  <div className="spec-details">
                    <h4>Anode (Elektroda Positif)</h4>
                    <p>
                      Elektroda yang dihubungkan dengan kutub positif sumber arus DC.
                      Anion (ion bermuatan negatif, seperti <FormulaRenderer formula="Cl-" />, <FormulaRenderer formula="SO4^2-" />)
                      akan bergerak mendekat dan mengalami oksidasi.
                    </p>
                  </div>
                </div>

                <div className="component-spec-card">
                  <div className="spec-index">4</div>
                  <div className="spec-details">
                    <h4>Elektrolit (Lelehan atau Larutan Berair)</h4>
                    <p>
                      Media cair yang mengandung ion-ion bebas bergerak yang bertugas menghantarkan arus listrik
                      di dalam wadah. <strong>Peringatan konsep:</strong> Elektron tidak mengalir di dalam cairan;
                      yang bergerak dalam larutan adalah kation dan anion.
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigasi Footer Tab */}
              <div className="modal-step-nav-split">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setActiveTab('1.2')}
                >
                  <ArrowLeft size={16} />
                  <span>Kembali ke 1.2</span>
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setActiveTab('1.4')}
                >
                  <span>Lanjut ke 1.4: Cek Pemahaman</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* BAGIAN 1.4: CEK PEMAHAMAN */}
          {activeTab === '1.4' && (
            <div className="lab-sheet-view">
              <div className="sheet-section-title">
                <span className="part-number">Bagian 1.4</span>
                <h3>Cek Pemahaman & Terminologi Laboratorium</h3>
              </div>

              <p className="sheet-intro-p">
                Uji ingatan dan pemahaman Anda terhadap konsep dasar Modul 1. Jawab pertanyaan di bawah ini
                untuk melihat evaluasi langsung:
              </p>

              {/* Pertanyaan 1 */}
              <div className="quiz-question-box">
                <h4 className="q-title">
                  1. Pada sel elektrolisis, elektroda tempat terjadinya reaksi REDUKSI adalah:
                </h4>
                <div className="q-options">
                  {[
                    { key: 'A', text: 'Katode dan terhubung ke kutub negatif (-)', correct: true },
                    { key: 'B', text: 'Anode dan terhubung ke kutub positif (+)', correct: false },
                    { key: 'C', text: 'Katode dan terhubung ke kutub positif (+)', correct: false },
                    { key: 'D', text: 'Anode dan terhubung ke kutub negatif (-)', correct: false },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      className={`q-opt-btn ${q1Answer === opt.key ? (opt.correct ? 'opt-correct' : 'opt-wrong') : ''}`}
                      onClick={() => setQ1Answer(opt.key)}
                    >
                      <span className="opt-key">{opt.key}</span>
                      <span>{opt.text}</span>
                    </button>
                  ))}
                </div>

                {q1Answer && (
                  <div className={`q-feedback ${q1Answer === 'A' ? 'feedback-success' : 'feedback-review'}`}>
                    <CheckCircle2 size={16} />
                    <span>
                      {q1Answer === 'A'
                        ? 'Tepat sekali! Mengikuti aturan KRAO (Katode = Reduksi) dan mnemonik PANIC (Katode elektrolisis bermuatan negatif).'
                        : 'Belum tepat. Ingat aturan KRAO: Katode selalu tempat reduksi, dan pada sel elektrolisis katode terhubung ke kutub negatif.'}
                    </span>
                  </div>
                )}
              </div>

              {/* Pertanyaan 2 */}
              <div className="quiz-question-box">
                <h4 className="q-title">
                  2. Bagaimana aliran elektron yang benar pada rangkaian sel elektrolisis?
                </h4>
                <div className="q-options">
                  {[
                    { key: 'A', text: 'Mengalir bebas menembus larutan elektrolit dari katode ke anode', correct: false },
                    { key: 'B', text: 'Mengalir melalui kawat sirkuit luar dari anode menuju katode', correct: true },
                    { key: 'C', text: 'Mengalir dari kation menuju anion di dalam larutan', correct: false },
                    { key: 'D', text: 'Tidak ada perpindahan elektron sama sekali', correct: false },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      className={`q-opt-btn ${q2Answer === opt.key ? (opt.correct ? 'opt-correct' : 'opt-wrong') : ''}`}
                      onClick={() => setQ2Answer(opt.key)}
                    >
                      <span className="opt-key">{opt.key}</span>
                      <span>{opt.text}</span>
                    </button>
                  ))}
                </div>

                {q2Answer && (
                  <div className={`q-feedback ${q2Answer === 'B' ? 'feedback-success' : 'feedback-review'}`}>
                    <CheckCircle2 size={16} />
                    <span>
                      {q2Answer === 'B'
                        ? 'Benar! Elektron mengalir di rangkaian kawat luar. Di dalam larutan, penghantaran muatan dilakukan oleh pergerakan ion (kation & anion).'
                        : 'Kurang tepat. Elektron tidak pernah bergerak bebas di dalam cairan elektrolit; arus di cairan dihantarkan oleh migrasi ion!'}
                    </span>
                  </div>
                )}
              </div>

              {/* Tombol Selesai */}
              <div className="modal-finish-box">
                <h4>Selamat! Anda telah menyelesaikan pratinjau lembar materi Modul 1.</h4>
                <p>
                  Konsep dasar ini menjadi fondasi sebelum memasuki simulator interaktif pergerakan ion (Bab 2)
                  dan laboratorium virtual prediksi produk elektrolisis lelehan/larutan (Bab 3).
                </p>
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={onClose}
                >
                  <CheckCircle2 size={18} />
                  <span>Tutup & Kembali ke Beranda ChemVerse</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
