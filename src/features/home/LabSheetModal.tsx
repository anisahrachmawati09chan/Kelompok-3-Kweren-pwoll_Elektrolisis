import React, { useState } from 'react';
import {
  X,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Award,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { FormulaRenderer } from '../../components/chemistry/FormulaRenderer';
import { ReactionEquation } from '../../components/chemistry/ReactionEquation';
import type { QuizQuestion } from '../../data/questionsData';
import { DEFAULT_QUESTIONS } from '../../data/questionsData';

interface LabSheetModalProps {
  initialSubtopicId?: string;
  onClose: () => void;
  questions?: QuizQuestion[];
  onScoreUpdate?: (score: number, maxScore: number) => void;
}

/**
 * LabSheetModal: Lembar Belajar Laboratorium Mandiri Modul 1.
 * Menampilkan:
 * 1. Teori Redoks & Komponen Sel Elektrolisis
 * 2. Cek Pemahaman Dinamis yang terhubung dengan Bank Soal Guru
 * 3. Skor otomatis yang langsung tersinkronisasi ke Dashboard Guru
 */
export const LabSheetModal: React.FC<LabSheetModalProps> = ({
  initialSubtopicId = '1.1',
  onClose,
  questions = DEFAULT_QUESTIONS,
  onScoreUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialSubtopicId);

  // State jawaban pilihan ganda dinamis (qId -> 'A' | 'B' | dll)
  const [mcAnswers, setMcAnswers] = useState<Record<string, string>>({});

  // State jawaban tabel benar-salah dinamis (qId -> { num: 'benar' | 'salah' })
  const [tfAnswers, setTfAnswers] = useState<Record<string, Record<number, 'benar' | 'salah' | null>>>({});

  // Handler memilih opsi pilihan ganda
  const handleSelectMCOption = (questionId: string, optKey: string) => {
    const updated = { ...mcAnswers, [questionId]: optKey };
    setMcAnswers(updated);
    calcAndNotifyScore(updated, tfAnswers);
  };

  // Handler memilih benar/salah pada tabel
  const handleSelectTF = (questionId: string, statementNum: number, value: 'benar' | 'salah') => {
    const prevQ = tfAnswers[questionId] || {};
    const updatedQ = { ...prevQ, [statementNum]: value };
    const updatedAll = { ...tfAnswers, [questionId]: updatedQ };
    setTfAnswers(updatedAll);
    calcAndNotifyScore(mcAnswers, updatedAll);
  };

  // Hitung skor total dan simpan ke rekam nilai siswa
  const calcAndNotifyScore = (
    currentMC: Record<string, string>,
    currentTF: Record<string, Record<number, 'benar' | 'salah' | null>>
  ) => {
    let score = 0;
    questions.forEach((q) => {
      if (q.type === 'multiple_choice') {
        const chosenKey = currentMC[q.id];
        const correctOpt = q.options.find((opt) => opt.isCorrect)?.key;
        if (chosenKey && chosenKey === correctOpt) {
          score += 1;
        }
      } else if (q.type === 'true_false_table') {
        const answersForQ = currentTF[q.id] || {};
        const allCorrect = q.statements.every((st) => answersForQ[st.num] === st.correct);
        if (allCorrect) {
          score += 1;
        }
      }
    });

    if (onScoreUpdate) {
      onScoreUpdate(score, questions.length);
    }
  };

  const handleResetQuiz = () => {
    setMcAnswers({});
    setTfAnswers({});
    if (onScoreUpdate) {
      onScoreUpdate(0, questions.length);
    }
  };

  // Hitung jumlah jawaban benar saat ini untuk tampilan
  let currentScore = 0;
  questions.forEach((q) => {
    if (q.type === 'multiple_choice') {
      const chosenKey = mcAnswers[q.id];
      const correctOpt = q.options.find((opt) => opt.isCorrect)?.key;
      if (chosenKey && chosenKey === correctOpt) currentScore += 1;
    } else if (q.type === 'true_false_table') {
      const answersForQ = tfAnswers[q.id] || {};
      const allCorrect = q.statements.every((st) => answersForQ[st.num] === st.correct);
      if (allCorrect) currentScore += 1;
    }
  });

  const tabs = [
    { id: '1.1', label: '1.1 Reaksi Redoks' },
    { id: '1.2', label: '1.2 Volta vs Elektrolisis' },
    { id: '1.3', label: '1.3 Komponen Sel' },
    { id: '1.4', label: `1.4 Cek Pemahaman (${questions.length} Soal)` },
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

          <button
            type="button"
            className="btn-modal-close"
            onClick={onClose}
            aria-label="Tutup lembar belajar"
          >
            <X size={20} />
          </button>
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

              <div className="mnemonic-callout">
                <div className="mnemonic-title">
                  <BookOpen size={18} />
                  <strong>Mnemonik Penting Kimia SMA: &quot;KRAO&quot;</strong>
                </div>
                <div className="mnemonic-content">
                  <span className="mnemonic-item">
                    <strong>K - R:</strong> <strong>K</strong>atode tempat <strong>R</strong>eduksi
                  </span>
                  <span className="mnemonic-divider">•</span>
                  <span className="mnemonic-item">
                    <strong>A - O:</strong> <strong>A</strong>node tempat <strong>O</strong>ksidasi
                  </span>
                </div>
                <p className="mnemonic-note">
                  Aturan ini berlaku <em>mutlak</em> baik pada Sel Volta maupun Sel Elektrolisis!
                </p>
              </div>

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
                      <td>
                        <strong>Perubahan Energi</strong>
                      </td>
                      <td>Energi Kimia → Energi Listrik</td>
                      <td className="highlight-cell">Energi Listrik → Reaksi Kimia</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Spontanitas Reaksi</strong>
                      </td>
                      <td>Spontan (menghasilkan arus listrik)</td>
                      <td className="highlight-cell">Tidak Spontan (perlu suplai arus DC)</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Kutub Katode</strong>
                      </td>
                      <td>Kutub Positif (+)</td>
                      <td className="highlight-cell katode-col">Kutub Negatif (-)</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Kutub Anode</strong>
                      </td>
                      <td>Kutub Negatif (-)</td>
                      <td className="highlight-cell anode-col">Kutub Positif (+)</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Reaksi di Katode</strong>
                      </td>
                      <td>Reduksi (menerima e⁻)</td>
                      <td>Reduksi (menerima e⁻)</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Reaksi di Anode</strong>
                      </td>
                      <td>Oksidasi (melepas e⁻)</td>
                      <td>Oksidasi (melepas e⁻)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

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

          {/* BAGIAN 1.4: CEK PEMAHAMAN DINAMIS (TERHUBUNG KE BANK SOAL GURU) */}
          {activeTab === '1.4' && (
            <div className="lab-sheet-view">
              <div className="sheet-section-title">
                <span className="part-number">Bagian 1.4</span>
                <h3>Cek Pemahaman & Latihan Konsep Elektrolisis</h3>
              </div>

              {/* Header Skor & Evaluasi */}
              <div className="quiz-section-header">
                <div>
                  <strong>Bank Latihan Formatif Elektrokimia</strong>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Kerjakan {questions.length} soal berikut. Nilai Anda langsung tercatat di panel guru.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span className="quiz-score-pill">
                    <Award size={16} />
                    <span>
                      Skor: {currentScore} / {questions.length} Soal Selesai
                    </span>
                  </span>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleResetQuiz}
                    title="Ulangi Pengerjaan Soal"
                  >
                    <RotateCcw size={14} />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* RENDER DINAMIS SEMUA SOAL DARI BANK SOAL */}
              {questions.map((q, idx) => {
                if (q.type === 'multiple_choice') {
                  const chosenKey = mcAnswers[q.id];
                  const correctOpt = q.options.find((opt) => opt.isCorrect)?.key;
                  const isAnswered = Boolean(chosenKey);
                  const isCorrect = chosenKey === correctOpt;

                  return (
                    <div key={q.id} className="quiz-question-box">
                      <div className="q-header-row">
                        <span className="q-number-pill">{q.title || `Soal ${idx + 1}`}</span>
                        <span className="q-topic-tag">{q.topic}</span>
                      </div>

                      <div className="q-prompt-text">{q.questionText}</div>

                      <div className="q-options-list">
                        {q.options.map((opt) => (
                          <button
                            key={opt.key}
                            type="button"
                            className={`q-option-item ${
                              chosenKey === opt.key
                                ? opt.isCorrect
                                  ? 'selected-correct'
                                  : 'selected-wrong'
                                : ''
                            }`}
                            onClick={() => handleSelectMCOption(q.id, opt.key)}
                          >
                            <span className="option-badge-key">{opt.key}</span>
                            <span>{opt.text}</span>
                          </button>
                        ))}
                      </div>

                      {/* Panel Pembahasan Otomatis */}
                      {isAnswered && (
                        <div
                          className={`q-explanation-panel ${
                            isCorrect ? 'feedback-correct' : 'feedback-incorrect'
                          }`}
                        >
                          <div className="explanation-header">
                            {isCorrect ? (
                              <>
                                <CheckCircle2 size={18} />
                                <span>Jawaban Anda Benar ({correctOpt})!</span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle size={18} />
                                <span>Jawaban Belum Tepat. Kunci yang benar adalah {correctOpt}.</span>
                              </>
                            )}
                          </div>
                          <div className="explanation-steps">
                            <strong>Pembahasan Soal:</strong>
                            <p style={{ margin: '0.4rem 0', lineHeight: 1.5 }}>{q.explanation}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                // Jika Tipe Tabel Benar-Salah (Soal 4)
                if (q.type === 'true_false_table') {
                  const answersForQ = tfAnswers[q.id] || {};
                  const correctCount = q.statements.filter((st) => answersForQ[st.num] === st.correct).length;
                  const isAllCorrect = correctCount === q.statements.length;

                  return (
                    <div key={q.id} className="quiz-question-box">
                      <div className="q-header-row">
                        <span className="q-number-pill">{q.title || `Soal ${idx + 1}`}</span>
                        <span className="q-topic-tag">{q.topic}</span>
                      </div>

                      <div className="q-prompt-text">{q.questionText}</div>

                      <div className="tf-table-wrapper">
                        <table className="tf-interactive-table">
                          <thead>
                            <tr>
                              <th style={{ width: '45px' }}>No.</th>
                              <th>Pernyataan</th>
                              <th className="tf-actions-col">Pilihan Anda</th>
                            </tr>
                          </thead>
                          <tbody>
                            {q.statements.map((item) => {
                              const currentVal = answersForQ[item.num];
                              const isAnsweredRow = currentVal !== undefined && currentVal !== null;
                              const isCorrectRow = currentVal === item.correct;

                              return (
                                <tr key={item.num}>
                                  <td style={{ fontWeight: 700, color: 'var(--text-muted)' }}>
                                    {item.num}.
                                  </td>
                                  <td className="tf-statement-col">
                                    <div>{item.text}</div>
                                    {isAnsweredRow && (
                                      <div
                                        className={`tf-row-feedback ${
                                          isCorrectRow ? 'correct-text' : 'wrong-text'
                                        }`}
                                      >
                                        {isCorrectRow ? (
                                          <CheckCircle2 size={13} />
                                        ) : (
                                          <AlertTriangle size={13} />
                                        )}
                                        <span>{item.reason}</span>
                                      </div>
                                    )}
                                  </td>
                                  <td className="tf-actions-col">
                                    <div className="tf-btn-group">
                                      <button
                                        type="button"
                                        className={`tf-toggle-btn ${
                                          currentVal === 'benar' ? 'active-true' : ''
                                        }`}
                                        onClick={() => handleSelectTF(q.id, item.num, 'benar')}
                                      >
                                        Benar
                                      </button>
                                      <button
                                        type="button"
                                        className={`tf-toggle-btn ${
                                          currentVal === 'salah' ? 'active-false' : ''
                                        }`}
                                        onClick={() => handleSelectTF(q.id, item.num, 'salah')}
                                      >
                                        Salah
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.5rem 0.25rem',
                          fontSize: '0.85rem',
                        }}
                      >
                        <span style={{ color: 'var(--text-secondary)' }}>
                          Pernyataan Benar: <strong>{correctCount} dari {q.statements.length}</strong>
                        </span>
                        {isAllCorrect && (
                          <span
                            style={{
                              color: 'var(--status-success-text)',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                          >
                            <CheckCircle2 size={16} />
                            <span>Sempurna! Seluruh pernyataan telah dianalisis dengan tepat.</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }

                return null;
              })}

              {/* Box Selesai & Motivasi Belajar */}
              <div className="modal-finish-box">
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-100)',
                    color: 'var(--primary-700)',
                    marginBottom: '0.75rem',
                  }}
                >
                  <Sparkles size={24} />
                </div>
                <h4>
                  {currentScore === questions.length
                    ? `Luar Biasa! Seluruh ${questions.length} Soal Berhasil Dituntaskan!`
                    : `Skor Anda: ${currentScore} dari ${questions.length} Soal`}
                </h4>
                <p>
                  Hasil latihan Anda otomatis terekam dan dapat dipantau oleh guru di Panel Guru ChemVerse.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={onClose}
                  >
                    <CheckCircle2 size={18} />
                    <span>Kembali ke Beranda ChemVerse</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-lg"
                    onClick={handleResetQuiz}
                  >
                    <RotateCcw size={16} />
                    <span>Ulangi Seluruh Soal</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
