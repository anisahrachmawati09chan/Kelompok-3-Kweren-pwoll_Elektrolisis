/**
 * Data Model & Mock Storage for "Tanya dengan Guru" (Teacher Q&A)
 * Designed for ChemVerse / ElectroLab - Kimia SMA Kelas 12 (Fase F)
 */

export interface Teacher {
  id: string;
  name: string;
  title: string;
  role: string;
  avatarInitials: string;
  avatarBg: string;
  status: 'online' | 'busy' | 'offline';
  statusLabel: string;
  specialty: string;
  officeHours: string;
  whatsappNumber: string;
  bio: string;
}

export interface QuestionReply {
  id: string;
  senderType: 'teacher' | 'student';
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: string;
  formulaNotes?: string;
}

export interface TeacherQuestion {
  id: string;
  studentName: string;
  studentClass: string;
  teacherId: string;
  teacherName: string;
  topic: string;
  title: string;
  content: string;
  status: 'answered' | 'waiting';
  createdAt: string;
  replies: QuestionReply[];
  likes: number;
}

export const TEACHERS_LIST: Teacher[] = [
  {
    id: 'guru-ratna',
    name: 'Dra. Hj. Ratna Juwita, M.Pd.',
    title: 'Guru Pengampu Kimia Kelas XII',
    role: 'Spesialis Elektrokimia & Praktikum Sel',
    avatarInitials: 'RJ',
    avatarBg: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    status: 'online',
    statusLabel: 'Online • Siap Menjawab',
    specialty: 'Reaksi Redoks, Sel Elektrolisis Lelehan & Larutan, Mnemonik PANIC & KRAO',
    officeHours: 'Senin - Jumat (07.30 - 16.00 WIB)',
    whatsappNumber: '6281234567890',
    bio: 'Pengalaman 18 tahun mengajar Kimia SMA. Siap membantu memahami reaksi elektroda tanpa hafalan rumit!',
  },
  {
    id: 'guru-fauzi',
    name: 'Ahmad Fauzi, S.Si., M.Sc.',
    title: 'Guru Kimia & Pembina Olimpiade Kimia (OSN)',
    role: 'Spesialis Stoikiometri & Hukum Faraday',
    avatarInitials: 'AF',
    avatarBg: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
    status: 'online',
    statusLabel: 'Online • Respon Cepat',
    specialty: 'Hukum Faraday I & II, Perhitungan Arus & Massa Endapan, Aspek Kuantitatif Sel',
    officeHours: 'Senin - Sabtu (08.00 - 17.00 WIB)',
    whatsappNumber: '6281298765432',
    bio: 'Alumnus Kimia UI & ITB. Berfokus pada penalaran sistematis matematika reaksi dan stoikiometri elektrokimia.',
  },
  {
    id: 'guru-nurul',
    name: 'Nurul Hidayati, S.Pd.',
    title: 'Guru Kimia Fase F SMA',
    role: 'Spesialis Konsep Dasar & Evaluasi Belajar',
    avatarInitials: 'NH',
    avatarBg: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
    status: 'busy',
    statusLabel: 'Sedang Mengajar • Balas ~15 mnt',
    specialty: 'Komparasi Sel Volta vs Elektrolisis, Deret Volta, Elektroda Inert vs Aktif',
    officeHours: 'Senin - Jumat (08.00 - 15.30 WIB)',
    whatsappNumber: '6281356789012',
    bio: 'Mengajar kimia dengan pendekatan visual dan kontekstual kehidupan sehari-hari (penyepuhan logam, baterai).',
  },
];

export const TOPIC_OPTIONS = [
  'Bab 1.1: Konsep Reaksi Oksidasi & Reduksi',
  'Bab 1.2: Perbedaan Sel Volta vs Sel Elektrolisis',
  'Bab 1.3: Komponen Sel & Elektroda (Inert vs Aktif)',
  'Aturan Katode & Anode (KRAO & PANIC)',
  'Elektrolisis Larutan vs Lelehan / Cairan',
  'Hukum Faraday I & II (Perhitungan Kuantitatif)',
  'Praktikum & Simulasi Virtual Lab',
  'Latihan Soal Ujian & Evaluasi',
];

export const INITIAL_QUESTIONS: TeacherQuestion[] = [
  {
    id: 'q-101',
    studentName: 'Elsa Rasengraffe',
    studentClass: 'Kelas 12 IPA 1',
    teacherId: 'guru-ratna',
    teacherName: 'Dra. Hj. Ratna Juwita, M.Pd.',
    topic: 'Aturan Katode & Anode (KRAO & PANIC)',
    title: 'Bagaimana cara mudah mengingat kutub positif dan negatif di sel elektrolisis vs sel volta?',
    content: 'Bu Ratna, saya sering tertukar kutub Anode dan Katode antara Sel Volta dan Sel Elektrolisis ketika ulangan. Apakah ada cara mudah mengingatnya agar tidak salah tanda positif atau negatif?',
    status: 'answered',
    createdAt: 'Hari ini, 09:15 WIB',
    likes: 8,
    replies: [
      {
        id: 'rep-101',
        senderType: 'teacher',
        senderName: 'Dra. Hj. Ratna Juwita, M.Pd.',
        senderRole: 'Guru Kimia Pengampu',
        timestamp: 'Hari ini, 09:28 WIB',
        content: `Halo Elsa! Pertanyaan yang sangat bagus dan sering sekali mengecoh siswa saat ujian.\n\nKuncinya ada pada dua aturan emas:\n1. **KRAO (Katode Reduksi, Anode Oksidasi)**: Aturan ini BERLAKU TETAP baik di Sel Volta maupun Sel Elektrolisis! Dimana ada reduksi pasti katode, dimana ada oksidasi pasti anode.\n2. Untuk kutub di Sel Elektrolisis, gunakan mnemonik **PANIC**:\n   • **P**ositive is **A**node (Anode = Kutub Positif)\n   • **N**egative **I**s **C**athode (Katode = Kutub Negatif)\n\nIngat di sel elektrolisis kita butuh sumber arus luar (baterai DC), sehingga katode terhubung ke kutub negatif baterai (menarik kation bermuatan positif), sedangkan anode terhubung ke kutub positif (menarik anion bermuatan negatif). Tetap semangat belajarnya ya!`,
        formulaNotes: 'PANIC: Positive Anode, Negative Is Cathode | KRAO: Katode-Reduksi, Anode-Oksidasi',
      },
    ],
  },
  {
    id: 'q-102',
    studentName: 'Revalina Putri',
    studentClass: 'Kelas 12 IPA 2',
    teacherId: 'guru-fauzi',
    teacherName: 'Ahmad Fauzi, S.Si., M.Sc.',
    topic: 'Elektrolisis Larutan vs Lelehan / Cairan',
    title: 'Mengapa pada elektrolisis larutan NaCl yang terbentuk di katode adalah gas H₂, bukan endapan Na?',
    content: 'Pak Fauzi, kenapa kalau larutan NaCl yang dielektrolisis di katode keluar gas H₂, sedangkan kalau lelehan (cairan murni) NaCl yang mengendap adalah logam Na? Kapan kita tahu air yang bereaksi?',
    status: 'answered',
    createdAt: 'Kemarin, 14:20 WIB',
    likes: 12,
    replies: [
      {
        id: 'rep-102',
        senderType: 'teacher',
        senderName: 'Ahmad Fauzi, S.Si., M.Sc.',
        senderRole: 'Guru Kimia & Pembina OSN',
        timestamp: 'Kemarin, 14:42 WIB',
        content: `Halo Revalina! Ini inti pemahaman fase larutan vs lelehan elektrolisis.\n\n1. **Pada Lelehan / Cairan murni (tanpa air)**:\n   Tidak ada molekul H₂O sama sekali. Maka ion Na⁺ tidak punya pesaing, sehingga Na⁺ wajib tereduksi menjadi logam Na:\n   Na⁺ + e⁻ → Na(s)\n\n2. **Pada Larutan (ada pelarut air H₂O)**:\n   Di katode terjadi kompetisi reduksi antara ion Na⁺ dan molekul H₂O. Nilai potensial reduksi standar E° air (-0,83 V) jauh lebih besar daripada E° ion Na⁺ (-2,71 V). Artinya air lebih mudah tereduksi!\n   Reaksi di katode:\n   2H₂O(l) + 2e⁻ → H₂(g) + 2OH⁻(aq)\n\n**Kaidah Singkat Guru:** Logam Golongan IA (Na, K), IIA (Mg, Ca), Al, dan Mn jika dalam bentuk larutan, maka **airlah yang tereduksi** menghasilkan gas H₂ dan basa OH⁻!`,
        formulaNotes: '2H₂O(l) + 2e⁻ → H₂(g) + 2OH⁻(aq) [E° = -0.83 V > E° Na⁺ = -2.71 V]',
      },
    ],
  },
  {
    id: 'q-103',
    studentName: 'Dimas Anggara',
    studentClass: 'Kelas 12 IPA 1',
    teacherId: 'guru-nurul',
    teacherName: 'Nurul Hidayati, S.Pd.',
    topic: 'Bab 1.3: Komponen Sel & Elektroda (Inert vs Aktif)',
    title: 'Perbedaan elektroda inert seperti Platina/Karbon dengan elektroda tembaga (Cu) di anode?',
    content: 'Bu Nurul, kapan elektroda itu ikut bereaksi (anode teroksidasi) dan kapan pelarut air yang teroksidasi? Terima kasih bu.',
    status: 'answered',
    createdAt: '2 hari lalu, 11:05 WIB',
    likes: 5,
    replies: [
      {
        id: 'rep-103',
        senderType: 'teacher',
        senderName: 'Nurul Hidayati, S.Pd.',
        senderRole: 'Guru Kimia Fase F',
        timestamp: '2 hari lalu, 11:30 WIB',
        content: `Halo Dimas! Sangat jeli memperhatikan jenis elektroda.\n\nElektroda terbagi dua:\n1. **Elektroda INERT (Tidak reaktif)**: Platina (Pt), Karbon / Grafit (C), dan Emas (Au). Elektroda ini hanya sebagai penghantar elektron dan TIDAK IKUT BEREAKSI. Reaksi anode ditentukan oleh anion larutan atau air.\n2. **Elektroda AKTIF (Non-inert)**: Logam selain Pt, C, Au (misalnya Cu, Ni, Ag, Fe, Zn). Jika elektroda aktif digunakan sebagai **ANODE**, maka elektroda itu sendiri yang akan teroksidasi larut menjadi ionnya:\n   Cu(s) → Cu²⁺(aq) + 2e⁻\n\nPrinsip ini yang kita manfaatkan pada proses **penyepuhan logam (electroplating)** dan pemurnian tembaga industri!`,
        formulaNotes: 'Elektroda Inert: C, Pt, Au (aman) | Elektroda Aktif: M(s) → Mⁿ⁺(aq) + ne⁻',
      },
    ],
  },
];

export const STORAGE_KEY_TEACHER_QUESTIONS = 'chemverse_teacher_questions_v2';

/**
 * Membaca daftar pertanyaan dari localStorage atau mengembalikan INITIAL_QUESTIONS
 */
export function getSavedQuestions(): TeacherQuestion[] {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem(STORAGE_KEY_TEACHER_QUESTIONS);
      if (saved) {
        return JSON.parse(saved);
      }
    }
  } catch (err) {
    console.warn('Gagal membaca pertanyaan guru dari localStorage:', err);
  }
  return INITIAL_QUESTIONS;
}

/**
 * Menyimpan daftar pertanyaan ke localStorage
 */
export function saveQuestions(questions: TeacherQuestion[]): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY_TEACHER_QUESTIONS, JSON.stringify(questions));
    }
  } catch (err) {
    console.warn('Gagal menyimpan pertanyaan guru ke localStorage:', err);
  }
}

/**
 * Menghasilkan respon bimbingan cerdas dan ramah dari guru
 */
export function generateTeacherResponse(
  teacher: Teacher,
  studentName: string,
  topic: string,
  userQuestion: string
): QuestionReply {
  const lowerQ = userQuestion.toLowerCase();
  let advice = '';
  let formula = '';

  if (lowerQ.includes('faraday') || lowerQ.includes('massa') || lowerQ.includes('arus') || lowerQ.includes('ampere')) {
    advice = `Halo ${studentName}! Terima kasih sudah bertanya tentang stoikiometri elektrokimia.\n\nUntuk perhitungan Hukum Faraday I, gunakan rumus patokan:\n**w = (e · i · t) / 96500**\ndimana:\n• w = massa endapan logam (gram)\n• e = massa ekivalen (Ar / valensi elektron n)\n• i = kuat arus listrik (Ampere)\n• t = waktu (wajib dalam satuan detik / sekon!)\n\nPerhatikan satuan waktu ya, jika dalam menit dikali 60, jika jam dikali 3600. Coba hitung dulu langkah awalnya, nanti bapak/ibu bantu cek hasilnya!`;
    formula = 'w = (e · i · t) / 96500 | e = Ar / n';
  } else if (lowerQ.includes('kutub') || lowerQ.includes('anode') || lowerQ.includes('katode') || lowerQ.includes('panic') || lowerQ.includes('krao')) {
    advice = `Halo ${studentName}! Pertanyaan bagus tentang identifikasi elektroda.\n\nIngat selalu dua panduan utama:\n1. **KRAO**: Katode tempat reduksi (menangkap e⁻), Anode tempat oksidasi (melepas e⁻).\n2. **PANIC**: Positive Anode, Negative Is Cathode pada sel elektrolisis.\n\nAliran elektron selalu bergerak dari **Anode (+) menuju Katode (-)** melalui kawat penghantar luar. Kation (+) tertarik ke Katode (-), sedangkan anion (-) bergerak ke Anode (+).`;
    formula = 'KRAO: Katode=Reduksi, Anode=Oksidasi | PANIC: (+) Anode, (-) Katode';
  } else if (lowerQ.includes('larutan') || lowerQ.includes('lelehan') || lowerQ.includes('air') || lowerQ.includes('h2o')) {
    advice = `Halo ${studentName}! Membedakan elektrolisis fase larutan dan lelehan memang perlu ketelitian.\n\n• **Pada lelehan**: Kation selalu tereduksi di katode, dan anion selalu teroksidasi di anode karena tidak ada air.\n• **Pada larutan**: Jika kation berasal dari golongan IA, IIA, Al³⁺, atau Mn²⁺, maka air (H₂O) yang tereduksi di katode menghasilkan gas H₂ dan ion OH⁻.\n• Jika anion adalah sisa asam oksi (seperti SO₄²⁻, NO₃⁻), maka air yang teroksidasi di anode menghasilkan gas O₂ dan ion H⁺!`;
    formula = 'Katode Air: 2H₂O + 2e⁻ → H₂ + 2OH⁻ | Anode Air: 2H₂O → O₂ + 4H⁺ + 4e⁻';
  } else {
    advice = `Halo ${studentName}! Pertanyaanmu mengenai topik "${topic}" telah bapak/ibu telaah dengan baik.\n\nSecara prinsip pada sel elektrolisis, energi listrik arus searah (DC) dipaksa memicu reaksi redoks yang semula tidak spontan (E°sel bernilai negatif). Pastikan kamu memeriksa 3 hal terlebih dahulu:\n1. Bentuk elektrolitnya (larutan dengan pelarut air atau lelehan murni)\n2. Jenis elektroda yang digunakan (inert Pt/C/Au atau logam aktif)\n3. Tuliskan setengah reaksi reduksi dan oksidasinya secara terpisah.\n\nJika ada langkah perhitungan atau persamaan reaksi spesifik yang ingin dicek bersama, silakan balas di thread ini ya!`;
    formula = 'ΔG > 0 (Non-spontan) | Arus Listrik DC → Energi Kimia';
  }

  return {
    id: 'rep-' + Date.now(),
    senderType: 'teacher',
    senderName: teacher.name,
    senderRole: teacher.title,
    content: advice,
    timestamp: 'Baru saja',
    formulaNotes: formula,
  };
}

