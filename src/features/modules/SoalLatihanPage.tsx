import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  RefreshCcw,
  Trophy,
  BookOpen,
  AlertCircle,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

/**
 * SoalLatihanPage: Bank soal latihan Elektrolisis Kimia Kelas XII
 * Mencakup soal pilihan ganda, soal perhitungan, dan soal uraian.
 * Sumber: Materi Kimia SMA Kelas XII – Elektrolisis (Kurikulum Merdeka Fase F)
 */

interface QuizOption {
  key: string;
  text: string;
  correct: boolean;
}

interface QuizQuestion {
  id: number;
  category: string;
  question: string;
  options: QuizOption[];
  explanation: string;
}

interface WorkedExample {
  id: number;
  title: string;
  question: string;
  steps: { label: string; content: string }[];
  answer: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: 'Konsep Dasar',
    question:
      'Pada sel elektrolisis, elektroda yang terhubung ke kutub negatif sumber arus dan terjadi reaksi reduksi disebut ...',
    options: [
      { key: 'A', text: 'Anode, bermuatan positif', correct: false },
      { key: 'B', text: 'Katode, bermuatan negatif', correct: true },
      { key: 'C', text: 'Katode, bermuatan positif', correct: false },
      { key: 'D', text: 'Anode, bermuatan negatif', correct: false },
      { key: 'E', text: 'Elektrode inert, tidak bermuatan', correct: false },
    ],
    explanation:
      'Pada sel elektrolisis: Katode dihubungkan ke kutub (−) sumber arus dan merupakan tempat reaksi REDUKSI (penerimaan elektron). Mnemonik: KRAO (Katode=Reduksi, Anode=Oksidasi) dan PANIC (Positive Anode, Negative Is Cathode).',
  },
  {
    id: 2,
    category: 'Konsep Dasar',
    question:
      'Perbedaan utama antara sel Volta dan sel Elektrolisis terletak pada ...',
    options: [
      { key: 'A', text: 'Jenis elektrolit yang digunakan', correct: false },
      { key: 'B', text: 'Jumlah elektroda yang dibutuhkan', correct: false },
      { key: 'C', text: 'Konversi energi dan spontanitas reaksi', correct: true },
      { key: 'D', text: 'Suhu operasi yang diperlukan', correct: false },
      { key: 'E', text: 'Warna larutan elektrolit', correct: false },
    ],
    explanation:
      'Sel Volta: Energi Kimia → Listrik (reaksi spontan). Sel Elektrolisis: Energi Listrik → Kimia (reaksi tidak spontan, butuh sumber arus DC dari luar).',
  },
  {
    id: 3,
    category: 'Reaksi Elektrode',
    question:
      'Pada elektrolisis larutan NaCl dengan elektrode karbon (inert), gas yang dihasilkan di katode adalah ...',
    options: [
      { key: 'A', text: 'Cl₂ (klorin)', correct: false },
      { key: 'B', text: 'Na (natrium)', correct: false },
      { key: 'C', text: 'O₂ (oksigen)', correct: false },
      { key: 'D', text: 'H₂ (hidrogen)', correct: true },
      { key: 'E', text: 'NaOH', correct: false },
    ],
    explanation:
      'Na⁺ adalah logam aktif (kiri H dalam deret volta) → tidak direduksi. Sebagai gantinya, air yang direduksi di katode: 2H₂O + 2e⁻ → H₂(g) + 2OH⁻. Di anode, Cl⁻ dioksidasi: 2Cl⁻ → Cl₂ + 2e⁻.',
  },
  {
    id: 4,
    category: 'Reaksi Elektrode',
    question:
      'Pada elektrolisis lelehan NaCl dengan elektrode inert, produk yang dihasilkan di katode adalah ...',
    options: [
      { key: 'A', text: 'Na(s) logam padat', correct: false },
      { key: 'B', text: 'Na(l) logam cair', correct: true },
      { key: 'C', text: 'H₂(g)', correct: false },
      { key: 'D', text: 'Cl₂(g)', correct: false },
      { key: 'E', text: 'NaOH(aq)', correct: false },
    ],
    explanation:
      'Lelehan NaCl tidak mengandung air. Ion Na⁺ langsung tereduksi: Na⁺(l) + e⁻ → Na(l). Karena suhu tinggi, Na dihasilkan dalam bentuk cair. Ini adalah proses Downs untuk produksi natrium logam.',
  },
  {
    id: 5,
    category: 'Reaksi Elektrode',
    question:
      'Pada elektrolisis larutan CuSO₄ dengan anode tembaga (elektrode aktif), yang terjadi pada anode adalah ...',
    options: [
      { key: 'A', text: 'Oksidasi air: 2H₂O → O₂ + 4H⁺ + 4e⁻', correct: false },
      { key: 'B', text: 'Oksidasi SO₄²⁻ menjadi S₂O₈²⁻', correct: false },
      { key: 'C', text: 'Reduksi Cu²⁺ menjadi Cu', correct: false },
      { key: 'D', text: 'Oksidasi logam Cu: Cu → Cu²⁺ + 2e⁻', correct: true },
      { key: 'E', text: 'Tidak terjadi reaksi apapun', correct: false },
    ],
    explanation:
      'Elektrode aktif (seperti Cu) akan teroksidasi sendiri lebih mudah dari anion larutan. Cu(s) → Cu²⁺(aq) + 2e⁻. Atom Cu dari anode larut ke larutan dan Cu²⁺ mengendap di katode. Prinsip ini digunakan dalam electroplating dan pemurnian Cu.',
  },
  {
    id: 6,
    category: 'Hukum Faraday',
    question:
      'Arus 2 A dialirkan selama 965 detik melalui larutan CuSO₄. Massa Cu yang mengendap di katode adalah ... (Ar Cu = 64, F = 96.500 C/mol)',
    options: [
      { key: 'A', text: '0,32 gram', correct: false },
      { key: 'B', text: '0,64 gram', correct: true },
      { key: 'C', text: '1,28 gram', correct: false },
      { key: 'D', text: '0,16 gram', correct: false },
      { key: 'E', text: '1,92 gram', correct: false },
    ],
    explanation:
      'Q = I × t = 2 × 965 = 1930 C. Reaksi: Cu²⁺ + 2e⁻ → Cu (z = 2). m = (Ar × Q) / (z × F) = (64 × 1930) / (2 × 96500) = 123520 / 193000 = 0,64 gram.',
  },
  {
    id: 7,
    category: 'Hukum Faraday',
    question:
      'Dua sel elektrolisis dihubungkan seri: Sel I (AgNO₃) dan Sel II (CuSO₄). Jika 2,16 gram Ag mengendap pada Sel I, maka massa Cu yang mengendap di Sel II adalah ... (Ar Ag = 108, Cu = 64)',
    options: [
      { key: 'A', text: '0,32 gram', correct: false },
      { key: 'B', text: '1,28 gram', correct: false },
      { key: 'C', text: '0,64 gram', correct: true },
      { key: 'D', text: '2,16 gram', correct: false },
      { key: 'E', text: '0,96 gram', correct: false },
    ],
    explanation:
      'Hukum Faraday II: w₁/e₁ = w₂/e₂. e(Ag) = 108/1 = 108; e(Cu) = 64/2 = 32. 2,16/108 = w₂/32 → w₂ = (2,16 × 32)/108 = 69,12/108 = 0,64 gram.',
  },
  {
    id: 8,
    category: 'Aplikasi',
    question:
      'Dalam proses penyepuhan (electroplating) besi dengan nikel menggunakan larutan NiSO₄, posisi benda (besi) yang akan disepuh adalah sebagai ...',
    options: [
      { key: 'A', text: 'Anode, karena dioksidasi', correct: false },
      { key: 'B', text: 'Katode, karena terjadi reduksi (Ni²⁺ mengendap)', correct: true },
      { key: 'C', text: 'Larutan elektrolit', correct: false },
      { key: 'D', text: 'Sumber arus DC', correct: false },
      { key: 'E', text: 'Dapat sebagai anode atau katode', correct: false },
    ],
    explanation:
      'Penyepuhan: Benda yang akan dilapisi = KATODE (terjadi reduksi: Ni²⁺ + 2e⁻ → Ni yang menempel). Logam pelapis (nikel) = ANODE (teroksidasi: Ni → Ni²⁺ + 2e⁻). Larutan elektrolit = NiSO₄.',
  },
  {
    id: 9,
    category: 'Aplikasi',
    question:
      'Proses industri untuk produksi aluminium (Al) dari bahan baku Al₂O₃ dengan metode elektrolisis disebut ...',
    options: [
      { key: 'A', text: 'Proses Downs', correct: false },
      { key: 'B', text: 'Proses Klor-Alkali', correct: false },
      { key: 'C', text: 'Proses Hall-Héroult', correct: true },
      { key: 'D', text: 'Proses Solvay', correct: false },
      { key: 'E', text: 'Proses Haber-Bosch', correct: false },
    ],
    explanation:
      'Proses Hall-Héroult menggunakan elektrolisis lelehan Al₂O₃ dalam kriolit (Na₃AlF₆) untuk memproduksi aluminium. Proses Downs = produksi Na dari lelehan NaCl. Proses Klor-Alkali = produksi NaOH, Cl₂, H₂ dari larutan NaCl.',
  },
  {
    id: 10,
    category: 'Hukum Faraday',
    question:
      'Arus 5 A dialirkan selama 1 jam melalui larutan H₂SO₄ dengan elektrode Pt. Volume gas H₂ yang terbentuk di katode pada STP adalah ... (F = 96.500 C/mol)',
    options: [
      { key: 'A', text: '1,04 liter', correct: false },
      { key: 'B', text: '2,08 liter', correct: true },
      { key: 'C', text: '4,16 liter', correct: false },
      { key: 'D', text: '0,52 liter', correct: false },
      { key: 'E', text: '3,12 liter', correct: false },
    ],
    explanation:
      'Q = 5 × 3600 = 18.000 C. n(e⁻) = 18000/96500 = 0,1865 mol. Reaksi katode: 4H⁺ + 4e⁻ → 2H₂ → mol H₂ = n(e⁻)/2 = 0,09326 mol. V(H₂) di STP = 0,09326 × 22,4 = 2,09 ≈ 2,08 liter.',
  },
];

const WORKED_EXAMPLES: WorkedExample[] = [
  {
    id: 1,
    title: 'Contoh Soal 1: Reaksi pada Elektrode',
    question:
      'Tentukan reaksi yang terjadi di katode dan anode pada elektrolisis larutan MgCl₂ dengan elektrode karbon (inert)! Tulis persamaan reaksi lengkap.',
    steps: [
      { label: 'Langkah 1: Ionisasi', content: 'MgCl₂ → Mg²⁺ + 2Cl⁻' },
      {
        label: 'Langkah 2: Reaksi Katode',
        content:
          'Mg²⁺ adalah logam aktif (kiri H dalam deret volta) → air yang direduksi.\n2H₂O(l) + 2e⁻ → H₂(g) + 2OH⁻(aq)',
      },
      {
        label: 'Langkah 3: Reaksi Anode',
        content:
          'Cl⁻ adalah ion halida → dioksidasi menjadi gas klorin.\n2Cl⁻(aq) → Cl₂(g) + 2e⁻',
      },
      {
        label: 'Langkah 4: Reaksi Sel Keseluruhan',
        content: 'MgCl₂(aq) + 2H₂O(l) → Mg(OH)₂ + H₂(g) + Cl₂(g)',
      },
    ],
    answer: 'Katode: H₂(g) | Anode: Cl₂(g)',
  },
  {
    id: 2,
    title: 'Contoh Soal 2: Hukum Faraday I – Massa Endapan',
    question:
      'Arus listrik 2 A dialirkan selama 2 jam melalui larutan CuSO₄. Hitung massa tembaga yang mengendap di katode! (Ar Cu = 64, z = 2, F = 96.500 C/mol)',
    steps: [
      {
        label: 'Langkah 1: Hitung Muatan (Q)',
        content:
          'Q = I × t\nQ = 2 A × (2 × 3.600 s)\nQ = 2 × 7.200 = 14.400 C',
      },
      {
        label: 'Langkah 2: Hitung Massa Ekuivalen (e)',
        content:
          'e = Ar / valensi = 64 / 2 = 32 g/mol\n(Reaksi: Cu²⁺ + 2e⁻ → Cu, valensi = 2)',
      },
      {
        label: 'Langkah 3: Gunakan Rumus Faraday I',
        content:
          'w = (e × I × t) / 96.500\nw = (32 × 2 × 7.200) / 96.500\nw = 460.800 / 96.500',
      },
    ],
    answer: 'w ≈ 4,78 gram Cu',
  },
  {
    id: 3,
    title: 'Contoh Soal 3: Hukum Faraday II – Sel Seri',
    question:
      'Dua sel elektrolisis dihubungkan seri. Sel I berisi larutan AgNO₃ dan Sel II berisi CuSO₄. Jika pada Sel I mengendap 2,16 gram Ag, berapa gram Cu yang mengendap di Sel II? (Ar Ag = 108, Cu = 64)',
    steps: [
      {
        label: 'Langkah 1: Massa Ekuivalen Masing-masing',
        content:
          'e(Ag) = Ar(Ag) / z(Ag) = 108 / 1 = 108 g/mol  [Ag⁺ + e⁻ → Ag]\ne(Cu) = Ar(Cu) / z(Cu) = 64 / 2 = 32 g/mol  [Cu²⁺ + 2e⁻ → Cu]',
      },
      {
        label: 'Langkah 2: Terapkan Hukum Faraday II',
        content:
          'w₁/e₁ = w₂/e₂\n2,16 / 108 = w₂ / 32',
      },
      {
        label: 'Langkah 3: Selesaikan untuk w₂',
        content:
          'w₂ = (2,16 × 32) / 108\nw₂ = 69,12 / 108',
      },
    ],
    answer: 'w₂ = 0,64 gram Cu',
  },
  {
    id: 4,
    title: 'Contoh Soal 4: Menghitung Waktu Elektrolisis',
    question:
      'Berapa lama arus 3 A harus dialirkan untuk mengendapkan 1,98 gram Ni dari larutan NiSO₄? (Ar Ni = 58,7, F = 96.500 C/mol)',
    steps: [
      {
        label: 'Langkah 1: Data dan Massa Ekuivalen',
        content:
          'w = 1,98 gram; I = 3 A\ne(Ni) = 58,7 / 2 = 29,35 g/mol  [Ni²⁺ + 2e⁻ → Ni]',
      },
      {
        label: 'Langkah 2: Variasi Rumus Faraday I',
        content:
          't = (w × 96.500) / (e × I)\nt = (1,98 × 96.500) / (29,35 × 3)\nt = 191.070 / 88,05',
      },
    ],
    answer: 't = 2.170 detik ≈ 36,2 menit',
  },
];

export const SoalLatihanPage: React.FC = () => {
  // State jawaban siswa untuk kuis pilihan ganda
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [openExample, setOpenExample] = useState<number | null>(1);

  const handleAnswer = (questionId: number, optionKey: string) => {
    if (showResults) return; // Lock setelah submit
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setUserAnswers({});
    setShowResults(false);
  };

  const correctCount = Object.entries(userAnswers).filter(([qId, ans]) => {
    const q = QUIZ_QUESTIONS.find((q) => q.id === Number(qId));
    return q?.options.find((o) => o.key === ans)?.correct;
  }).length;

  const answeredCount = Object.keys(userAnswers).length;
  const totalQuestions = QUIZ_QUESTIONS.length;

  const scorePercent = showResults
    ? Math.round((correctCount / totalQuestions) * 100)
    : 0;

  const getScoreLabel = () => {
    if (scorePercent >= 90) return { label: 'Sangat Baik! 🏆', color: '#059669' };
    if (scorePercent >= 75) return { label: 'Baik! 👍', color: '#2563eb' };
    if (scorePercent >= 60) return { label: 'Cukup — Perlu Latihan', color: '#d97706' };
    return { label: 'Perlu Belajar Lagi 📚', color: '#dc2626' };
  };

  return (
    <div className="modules-page">
      {/* Header */}
      <div className="modules-page-header">
        <div className="modules-header-content">
          <div className="modules-header-left">
            <span className="modules-kicker">KIMIA KELAS XII • ELEKTROLISIS</span>
            <h1 className="modules-main-title">Soal Latihan & Contoh Pembahasan</h1>
            <p className="modules-subtitle">
              Bank soal pilihan ganda interaktif, contoh soal perhitungan bertahap, dan latihan
              komprehensif untuk mempersiapkan ujian.
            </p>
          </div>
        </div>
        <div className="modules-howto-banner">
          <BookOpen size={18} className="howto-icon" />
          <div className="howto-text">
            <strong>Cara Menggunakan:</strong> Pilih jawaban pada setiap soal pilihan ganda,
            lalu klik <em>"Periksa Jawaban"</em> untuk melihat skor dan penjelasan lengkap.
            Contoh soal perhitungan dapat diluaskan untuk melihat langkah demi langkah.
          </div>
        </div>
      </div>

      {/* ======================================================
          BAGIAN 1: CONTOH SOAL PEMBAHASAN
      ====================================================== */}
      <div className="modules-section-title">
        <span className="section-num-badge">01</span>
        <div>
          <h2>Contoh Soal &amp; Pembahasan Bertahap</h2>
          <p>Klik pada setiap contoh soal untuk membuka langkah-langkah penyelesaian.</p>
        </div>
      </div>

      <div className="worked-examples-list">
        {WORKED_EXAMPLES.map((ex) => (
          <div key={ex.id} className="worked-example-card">
            <button
              type="button"
              className="worked-example-header"
              onClick={() => setOpenExample((prev) => (prev === ex.id ? null : ex.id))}
            >
              <div className="we-title-row">
                <span className="we-num">Soal {ex.id}</span>
                <h4 className="we-title">{ex.title}</h4>
              </div>
              <div className="we-chevron">
                {openExample === ex.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
            </button>

            {openExample === ex.id && (
              <div className="worked-example-body">
                <div className="we-question">
                  <strong>Soal:</strong>
                  <p>{ex.question}</p>
                </div>

                <div className="we-steps">
                  {ex.steps.map((step, idx) => (
                    <div key={idx} className="we-step">
                      <div className="we-step-label">
                        <span className="we-step-num">{idx + 1}</span>
                        <strong>{step.label}</strong>
                      </div>
                      <div className="we-step-content">
                        <pre>{step.content}</pre>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="we-answer">
                  <CheckCircle2 size={18} className="answer-icon" />
                  <div>
                    <strong>Jawaban:</strong> {ex.answer}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ======================================================
          BAGIAN 2: KUIS PILIHAN GANDA
      ====================================================== */}
      <div className="modules-section-title" style={{ marginTop: '2.5rem' }}>
        <span className="section-num-badge">02</span>
        <div>
          <h2>Kuis Pilihan Ganda Interaktif</h2>
          <p>{totalQuestions} soal pilihan ganda mencakup semua topik Elektrolisis Kelas XII.</p>
        </div>
      </div>

      {/* Panel Skor (hanya tampil setelah submit) */}
      {showResults && (
        <div
          className="score-panel"
          style={{ borderColor: getScoreLabel().color }}
        >
          <Trophy size={32} style={{ color: getScoreLabel().color }} />
          <div className="score-panel-info">
            <div className="score-fraction">
              {correctCount} / {totalQuestions} Benar
            </div>
            <div className="score-label" style={{ color: getScoreLabel().color }}>
              {getScoreLabel().label}
            </div>
            <div
              className="score-bar-track"
            >
              <div
                className="score-bar-fill"
                style={{
                  width: `${scorePercent}%`,
                  background: getScoreLabel().color,
                }}
              />
            </div>
            <div className="score-percent">{scorePercent}%</div>
          </div>
          <button type="button" className="btn-reset-quiz" onClick={handleReset}>
            <RefreshCcw size={16} />
            Ulangi Kuis
          </button>
        </div>
      )}

      {/* Progress jawaban */}
      {!showResults && (
        <div className="quiz-progress-bar-wrap">
          <div className="quiz-progress-label">
            Terjawab: {answeredCount} / {totalQuestions}
          </div>
          <div className="quiz-progress-track">
            <div
              className="quiz-progress-fill"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Daftar Soal */}
      <div className="quiz-questions-list">
        {QUIZ_QUESTIONS.map((q, qIdx) => {
          const userAns = userAnswers[q.id];
          const correctOption = q.options.find((o) => o.correct);

          return (
            <div key={q.id} className={`quiz-q-card ${showResults && userAns ? (q.options.find(o => o.key === userAns)?.correct ? 'q-correct' : 'q-wrong') : ''}`}>
              <div className="q-header">
                <span className="q-num">Soal {qIdx + 1}</span>
                <span className="q-category">{q.category}</span>
                {showResults && userAns && (
                  <span className={`q-result-icon ${q.options.find(o => o.key === userAns)?.correct ? 'icon-correct' : 'icon-wrong'}`}>
                    {q.options.find(o => o.key === userAns)?.correct
                      ? <CheckCircle2 size={18} />
                      : <XCircle size={18} />}
                  </span>
                )}
              </div>
              <p className="q-text">{q.question}</p>

              <div className="q-options-grid">
                {q.options.map((opt) => {
                  const isSelected = userAns === opt.key;
                  let optClass = 'q-option-btn';
                  if (showResults && isSelected) {
                    optClass += opt.correct ? ' opt-is-correct' : ' opt-is-wrong';
                  } else if (showResults && opt.correct) {
                    optClass += ' opt-show-correct';
                  } else if (isSelected) {
                    optClass += ' opt-selected';
                  }

                  return (
                    <button
                      key={opt.key}
                      type="button"
                      className={optClass}
                      onClick={() => handleAnswer(q.id, opt.key)}
                      disabled={showResults}
                    >
                      <span className="opt-key-pill">{opt.key}</span>
                      <span className="opt-text">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Penjelasan (muncul setelah submit) */}
              {showResults && (
                <div className={`q-explanation ${q.options.find(o => o.key === userAns)?.correct ? 'expl-correct' : 'expl-wrong'}`}>
                  <AlertCircle size={15} className="expl-icon" />
                  <div>
                    <strong>Jawaban benar: {correctOption?.key}. </strong>
                    {q.explanation}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tombol Submit */}
      {!showResults && (
        <div className="quiz-submit-row">
          <div className="submit-hint">
            {answeredCount < totalQuestions && (
              <span className="submit-incomplete">
                ⚠️ Masih ada {totalQuestions - answeredCount} soal yang belum dijawab.
              </span>
            )}
          </div>
          <button
            type="button"
            className="btn-submit-quiz"
            onClick={handleSubmit}
            disabled={answeredCount === 0}
          >
            <CheckCircle2 size={18} />
            Periksa Jawaban ({answeredCount}/{totalQuestions})
          </button>
        </div>
      )}
    </div>
  );
};

