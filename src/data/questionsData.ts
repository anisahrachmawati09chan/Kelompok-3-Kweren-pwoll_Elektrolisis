/**
 * Questions Data & Store for ChemVerse
 * Mendukung kuis dinamis untuk siswa dan fitur kelola soal (CRUD) untuk guru.
 */

export interface OptionItem {
  key: string;
  text: string;
  isCorrect: boolean;
}

export interface MultipleChoiceQuestion {
  id: string;
  type: 'multiple_choice';
  title: string;
  topic: string;
  questionText: string;
  options: OptionItem[];
  explanation: string;
}

export interface TrueFalseStatement {
  num: number;
  text: string;
  correct: 'benar' | 'salah';
  reason: string;
}

export interface TrueFalseQuestion {
  id: string;
  type: 'true_false_table';
  title: string;
  topic: string;
  questionText: string;
  statements: TrueFalseStatement[];
}

export type QuizQuestion = MultipleChoiceQuestion | TrueFalseQuestion;

export const DEFAULT_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    type: 'multiple_choice',
    title: 'Soal 1',
    topic: 'Elektrolisis Larutan KNO₃ (Elektroda Inert Pt)',
    questionText:
      'Larutan KNO₃ dielektrolisis menggunakan elektroda platina (Pt). Diketahui bahwa platina merupakan elektroda inert. Reaksi yang terjadi pada katode dan anode secara berurutan adalah ....',
    options: [
      { key: 'A', text: 'Katode: K⁺ + e⁻ → K; Anode: 2NO₃⁻ → N₂ + 3O₂', isCorrect: false },
      { key: 'B', text: 'Katode: 2H₂O + 2e⁻ → H₂ + 2OH⁻; Anode: 2H₂O → O₂ + 4H⁺ + 4e⁻', isCorrect: true },
      { key: 'C', text: 'Katode: 2H₂O → O₂ + 4H⁺ + 4e⁻; Anode: 2H₂O + 2e⁻ → H₂ + 2OH⁻', isCorrect: false },
      { key: 'D', text: 'Katode: K⁺ + e⁻ → K; Anode: 2H₂O → O₂ + 4H⁺ + 4e⁻', isCorrect: false },
      { key: 'E', text: 'Katode: 2H⁺ + 2e⁻ → H₂; Anode: 2NO₃⁻ → 2NO₂ + O₂ + 2e⁻', isCorrect: false },
    ],
    explanation:
      'Katode: Kation K⁺ (Golongan IA, E° = -2,92 V) kalah bersaing dengan air (E° = -0,83 V), sehingga air yang tereduksi (2H₂O + 2e⁻ → H₂ + 2OH⁻). Anode: Pt bersifat inert dan NO₃⁻ adalah sisa asam oksi (biloks N maksimum +5), sehingga air yang teroksidasi (2H₂O → O₂ + 4H⁺ + 4e⁻).',
  },
  {
    id: 'q2',
    type: 'multiple_choice',
    title: 'Soal 2',
    topic: 'Elektrolisis Larutan NaCl & Muatan Faraday',
    questionText:
      'Larutan NaCl dielektrolisis menggunakan elektroda grafit. Dari proses elektrolisis tersebut diperoleh gas klorin (Cl₂) sebanyak 11,2 liter pada kondisi STP. Diketahui volume molar gas pada STP adalah 22,4 L/mol dan tetapan Faraday sebesar 96.500 C/mol elektron. Berdasarkan informasi tersebut, pernyataan yang tepat mengenai reaksi elektrolisis dan muatan listrik yang digunakan adalah ....',
    options: [
      { key: 'A', text: 'Anode: 2Cl⁻ → Cl₂ + 2e⁻; Katode: 2H₂O + 2e⁻ → H₂ + 2OH⁻; Muatan listrik 48.250 C.', isCorrect: false },
      { key: 'B', text: 'Anode: 2Cl⁻ → Cl₂ + 2e⁻; Katode: 2H₂O + 2e⁻ → H₂ + 2OH⁻; Muatan listrik 96.500 C.', isCorrect: true },
      { key: 'C', text: 'Anode: 2H₂O → O₂ + 4H⁺ + 4e⁻; Katode: Na⁺ + e⁻ → Na; Muatan listrik 96.500 C.', isCorrect: false },
      { key: 'D', text: 'Anode: 2Cl⁻ → Cl₂ + 2e⁻; Katode: Na⁺ + e⁻ → Na; Muatan listrik 48.250 C.', isCorrect: false },
      { key: 'E', text: 'Anode: 2Cl⁻ → Cl₂ + 2e⁻; Katode: 2H⁺ + 2e⁻ → H₂; Muatan listrik 193.000 C.', isCorrect: false },
    ],
    explanation:
      'Katode: Na⁺ tidak tereduksi dalam larutan, melainkan air (2H₂O + 2e⁻ → H₂ + 2OH⁻). Anode: Ion halida Cl⁻ teroksidasi (2Cl⁻ → Cl₂ + 2e⁻). Mol Cl₂ = 11,2 / 22,4 = 0,5 mol. Mol e⁻ = 2 × 0,5 = 1,0 mol elektron. Q = 1,0 × 96.500 = 96.500 C.',
  },
  {
    id: 'q3',
    type: 'multiple_choice',
    title: 'Soal 3',
    topic: 'Elektrolisis Larutan CuSO₄ dan Lelehan AgI',
    questionText:
      'Elektrolisis larutan CuSO₄ menggunakan elektroda Fe selama 20 menit menghasilkan endapan tembaga sebanyak 3,175 gram. Arus listrik yang sama kemudian digunakan untuk melakukan elektrolisis lelehan AgI selama 30 menit. Diketahui Ar Cu = 63,5 g/mol, Ar Ag = 108 g/mol, dan tetapan Faraday = 96.500 C/mol elektron. Jika elektrolisis AgI menghasilkan endapan perak, massa perak yang dihasilkan dan reaksi pada masing-masing elektrode secara berurutan adalah ....',
    options: [
      { key: 'A', text: '10,8 gram; Katode: Ag⁺ + e⁻ → Ag; Anode: 2I⁻ → I₂ + 2e⁻.', isCorrect: false },
      { key: 'B', text: '16,2 gram; Katode: Ag⁺ + e⁻ → Ag; Anode: 2I⁻ → I₂ + 2e⁻.', isCorrect: true },
      { key: 'C', text: '21,6 gram; Katode: Ag⁺ + e⁻ → Ag; Anode: 2I⁻ → I₂ + 2e⁻.', isCorrect: false },
      { key: 'D', text: '16,2 gram; Katode: Ag⁺ + e⁻ → Ag; Anode: 2H₂O → O₂ + 4H⁺ + 4e⁻.', isCorrect: false },
      { key: 'E', text: '32,4 gram; Katode: Ag⁺ + e⁻ → Ag; Anode: 2I⁻ → I₂ + 2e⁻.', isCorrect: false },
    ],
    explanation:
      'CuSO₄: n(Cu) = 3,175 / 63,5 = 0,05 mol -> n(e⁻)₁ = 2 × 0,05 = 0,10 mol (20 menit). Lelehan AgI (30 menit, arus sama): n(e⁻)₂ = 1,5 × 0,10 = 0,15 mol. Katode: Ag⁺ + e⁻ → Ag -> n(Ag) = 0,15 mol. Anode: 2I⁻ → I₂ + 2e⁻ (lelehan, tanpa air). Massa Ag = 0,15 × 108 = 16,2 gram.',
  },
  {
    id: 'q4',
    type: 'true_false_table',
    title: 'Soal 4',
    topic: 'Pemurnian Logam Tembaga (Tabel Benar–Salah)',
    questionText:
      'Pemurnian logam tembaga dilakukan melalui proses elektrolisis menggunakan arus listrik sebesar 10 A dan menghasilkan 15,875 gram tembaga murni. Diketahui Ar Cu = 63,5 g/mol dan tetapan Faraday = 96.500 C/mol elektron. Tentukan apakah setiap pernyataan berikut benar atau salah!',
    statements: [
      {
        num: 1,
        text: 'Larutan elektrolit yang digunakan mengandung ion tembaga, misalnya CuSO₄.',
        correct: 'benar',
        reason: 'Benar: Larutan CuSO₄ berfungsi sebagai penyedia ion Cu²⁺ dalam medium elektrolit.',
      },
      {
        num: 2,
        text: 'Pada anode digunakan elektroda inert seperti platina atau grafit.',
        correct: 'salah',
        reason: 'Salah: Pada pemurnian tembaga, anode adalah tembaga kotor yang harus larut, bukan elektroda inert.',
      },
      {
        num: 3,
        text: 'Reaksi yang terjadi pada katode merupakan reaksi oksidasi.',
        correct: 'salah',
        reason: 'Salah: Katode selalu merupakan tempat terjadinya reaksi reduksi (aturan KRAO).',
      },
      {
        num: 4,
        text: 'Reaksi yang terjadi pada katode adalah Cu²⁺(aq) + 2e⁻ → Cu(s).',
        correct: 'benar',
        reason: 'Benar: Kation Cu²⁺ menerima 2 elektron di katode dan mengendap sebagai tembaga murni.',
      },
      {
        num: 5,
        text: 'Muatan listrik yang digunakan untuk menghasilkan 15,875 gram tembaga adalah sebesar 0,5 F.',
        correct: 'benar',
        reason: 'Benar: n(Cu) = 15,875/63,5 = 0,25 mol. n(e⁻) = 2 × 0,25 = 0,5 mol elektron = 0,5 Faraday.',
      },
      {
        num: 6,
        text: 'Waktu yang diperlukan untuk proses elektrolisis tersebut adalah 4.825 sekon.',
        correct: 'benar',
        reason: 'Benar: Q = 0,5 F × 96.500 C/F = 48.250 C. Waktu t = 48.250 / 10 = 4.825 sekon.',
      },
    ],
  },
];

const STORAGE_KEY_QUESTIONS = 'chemverse_questions_bank_v2';

export const questionStore = {
  getQuestions(): QuizQuestion[] {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = localStorage.getItem(STORAGE_KEY_QUESTIONS);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      }
    } catch (err) {
      console.warn('Gagal memuat bank soal:', err);
    }
    return DEFAULT_QUESTIONS;
  },

  saveQuestions(questions: QuizQuestion[]): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(questions));
      }
    } catch (err) {
      console.warn('Gagal menyimpan bank soal:', err);
    }
  },

  resetToDefault(): QuizQuestion[] {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(STORAGE_KEY_QUESTIONS);
      }
    } catch (err) {
      console.warn('Gagal mereset bank soal:', err);
    }
    return DEFAULT_QUESTIONS;
  },
};

