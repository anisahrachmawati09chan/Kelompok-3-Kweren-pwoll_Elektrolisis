/**
 * Course Syllabus and Roadmap Data for ChemVerse (ElectroLab)
 * Strictly adhering to PRD.md & Kurikulum Merdeka Fase F Kimia SMA Kelas 12
 */

export interface Subtopic {
  id: string;
  title: string;
  type: 'concept' | 'simulator' | 'calculator' | 'quiz' | 'exam';
  duration: string;
  description: string;
  keyFormula?: string;
}

export interface Chapter {
  id: number;
  chapterNumber: number;
  title: string;
  tagline: string;
  description: string;
  competencies: string[];
  subtopics: Subtopic[];
  badgeName: string;
  badgeDescription: string;
  status: 'available' | 'in_progress' | 'prerequisite_locked';
  statusLabel: string;
  color: string;
  accentColor: string;
  iconName: 'Zap' | 'Activity' | 'FlaskConical' | 'Calculator' | 'Award';
  milestonePhase: string;
}

export const CHAPTERS_DATA: Chapter[] = [
  {
    id: 1,
    chapterNumber: 1,
    title: 'Dasar Elektrokimia',
    tagline: 'Konsep Redoks, Sel Volta vs Sel Elektrolisis, dan Komponen Sel',
    description: 'Pahami perbedaan mendasar sel volta dan sel elektrolisis, perpindahan elektron, serta aturan polaritas elektroda: Katode (Reduksi, kutub negatif) dan Anode (Oksidasi, kutub positif).',
    competencies: [
      'Membedakan konversi energi sel volta (kimia ke listrik) dan sel elektrolisis (listrik ke kimia)',
      'Mengidentifikasi polaritas kutub katode (-) dan anode (+) pada sel elektrolisis',
      'Memahami reaksi reduksi (penangkapan elektron) dan oksidasi (pelepasan elektron)',
      'Menelusuri komponen sel: sumber DC, kabel kawat luar, larutan elektrolit, dan elektroda',
    ],
    subtopics: [
      {
        id: '1.1',
        title: '1.1 Reaksi Oksidasi dan Reduksi',
        type: 'concept',
        duration: '10 menit',
        description: 'Konsep transfer elektron: Oksidasi adalah pelepasan e⁻, Reduksi adalah penerimaan e⁻.',
        keyFormula: 'Reduksi: Cu²⁺ + 2e⁻ → Cu | Oksidasi: 2Cl⁻ → Cl₂ + 2e⁻',
      },
      {
        id: '1.2',
        title: '1.2 Sel Volta vs Sel Elektrolisis',
        type: 'concept',
        duration: '12 menit',
        description: 'Komparasi komprehensif: spontanitas reaksi, polaritas elektroda, dan perubahan bentuk energi.',
        keyFormula: 'Sel Elektrolisis: Energi Listrik DC → Reaksi Kimia (Non-Spontan)',
      },
      {
        id: '1.3',
        title: '1.3 Komponen Utama Sel Elektrolisis',
        type: 'concept',
        duration: '10 menit',
        description: '4 pilar perangkat: Sumber Arus DC, Katode (-), Anode (+), dan Cairan Elektrolit.',
        keyFormula: 'Kutub baterai (-) → Katode | Kutub baterai (+) → Anode',
      },
      {
        id: '1.4',
        title: '1.4 Cek Pemahaman & Istilah Lab',
        type: 'quiz',
        duration: '10 menit',
        description: 'Uji cepat pemahaman konsep istilah dasar sebelum memasuki simulator ion.',
      },
    ],
    badgeName: 'Penjelajah Redoks',
    badgeDescription: 'Menguasai konsep dasar redoks dan pemahaman sel elektrokimia',
    status: 'available',
    statusLabel: 'Tersedia — Siap Dipelajari',
    color: '#0284C7',
    accentColor: '#E0F2FE',
    iconName: 'Zap',
    milestonePhase: 'Milestone 2 (Aktif)',
  },
  {
    id: 2,
    chapterNumber: 2,
    title: 'Cara Kerja Sel Elektrolisis',
    tagline: 'Rangkaian Listrik DC, Aliran Elektron, dan Migrasi Ion',
    description: 'Menelusuri aliran elektron pada rangkaian kawat luar dan migrasi ion dalam larutan: kation menuju katode dan anion menuju anode (tanpa elektron bebas dalam larutan).',
    competencies: [
      'Menelusuri arah elektron keluar dari kutub (-) baterai menuju katode',
      'Menjelaskan migrasi kation menuju katode dan anion menuju anode',
      'Mengoperasikan simulator rangkaian dengan tombol kontrol interaktif',
    ],
    subtopics: [
      { id: '2.1', title: '2.1 Sumber Arus Searah dan Rangkaian', type: 'concept', duration: '10 mnt', description: 'Peran baterai DC mendorong elektron ke katode' },
      { id: '2.2', title: '2.2 Katode, Anode, Kation, dan Anion', type: 'concept', duration: '12 mnt', description: 'Pasangan elektroda dan muatan ion yang tertarik' },
      { id: '2.3', title: '2.3 Arah Aliran Elektron & Migrasi Ion', type: 'concept', duration: '10 mnt', description: 'Elektron hanya di kawat; ion menghantarkan muatan di cairan' },
      { id: '2.4', title: 'Simulator Rangkaian Sel Elektrolisis', type: 'simulator', duration: '15 mnt', description: 'Simulasi interaktif aliran partikel mikroskopis' },
    ],
    badgeName: 'Ahli Elektroda',
    badgeDescription: 'Memahami rangkaian listrik dan pergerakan partikel ionik',
    status: 'prerequisite_locked',
    statusLabel: 'Belum Tersedia — Terkunci (Selesaikan Bab 1 Dahulu)',
    color: '#2563EB',
    accentColor: '#EFF6FF',
    iconName: 'Activity',
    milestonePhase: 'Milestone 3',
  },
  {
    id: 3,
    chapterNumber: 3,
    title: 'Prediksi Reaksi & Produk Elektrolisis',
    tagline: 'Lelehan vs Larutan Berair, Elektroda Inert & Aktif',
    description: 'Menentukan reaksi reduksi di katode dan oksidasi di anode berdasarkan kompetisi ion, potensial reduksi, jenis pelarut air, serta bahan elektroda inert (Pt/C) atau aktif (Cu).',
    competencies: [
      'Membedakan elektrolisis lelehan murni tanpa air dengan larutan berair',
      'Menentukan kompetisi reduksi kation vs air (H₂O) di katode',
      'Menentukan kompetisi oksidasi anion vs air / elektroda aktif di anode',
      'Menyusun persamaan setengah reaksi yang setara atom dan muatannya',
    ],
    subtopics: [
      { id: '3.1', title: '3.1 Elektrolisis Lelehan (Tanpa Air)', type: 'concept', duration: '12 mnt', description: 'Skenario lelehan NaCl membentuk Na(l) dan Cl₂(g)' },
      { id: '3.2', title: '3.2 Larutan Berair dengan Elektroda Inert', type: 'concept', duration: '15 mnt', description: 'Kompetisi H₂O vs ion garam' },
      { id: '3.3', title: '3.3 Elektrolisis dengan Elektroda Aktif', type: 'concept', duration: '12 mnt', description: 'Anode Cu melarut pada larutan CuSO₄' },
      { id: '3.4', title: 'Laboratorium Virtual Produk Elektrolisis', type: 'simulator', duration: '20 mnt', description: 'Eksperimen virtual pemilihan zat dan produk' },
    ],
    badgeName: 'Analis Produk Elektrolisis',
    badgeDescription: 'Mampu memprediksi spesies yang bereaksi di kedua elektroda',
    status: 'prerequisite_locked',
    statusLabel: 'Belum Tersedia — Terkunci (Tahap Bab 3)',
    color: '#0D9488',
    accentColor: '#F0FDFA',
    iconName: 'FlaskConical',
    milestonePhase: 'Milestone 4',
  },
  {
    id: 4,
    chapterNumber: 4,
    title: 'Kalkulator Hukum Faraday',
    tagline: 'Perhitungan Muatan Listrik, Mol Elektron, dan Massa Endapan',
    description: 'Menerapkan Hukum Faraday I dan II: Q = I × t, n(e⁻) = Q / F, dan m = (M × I × t) / (z × F) dengan ketetapan Faraday F = 96.485 C/mol secara transparan.',
    competencies: [
      'Menghubungkan arus (A) dan waktu (s) dengan muatan listrik (Coulomb)',
      'Mengonversi muatan menjadi mol elektron dengan tetapan Faraday 96.485 C/mol',
      'Menghitung massa endapan logam atau volume gas sesuai persamaan reaksi',
    ],
    subtopics: [
      { id: '4.1', title: '4.1 Muatan Listrik, Arus, dan Waktu', type: 'concept', duration: '10 mnt', description: 'Korelasi Q = I × t' },
      { id: '4.2', title: '4.2 Hubungan Muatan dengan Mol Elektron', type: 'concept', duration: '12 mnt', description: '1 Faraday setara 1 mol elektron (96.485 C)' },
      { id: '4.3', title: '4.3 Perhitungan Massa Endapan & Gas', type: 'concept', duration: '15 mnt', description: 'Rumus kuantitatif m = (M·I·t)/(z·F)' },
      { id: '4.4', title: 'Kalkulator Interaktif Hukum Faraday', type: 'calculator', duration: '15 mnt', description: 'Kalkulasi bertahap dengan substitusi angka' },
    ],
    badgeName: 'Master Hukum Faraday',
    badgeDescription: 'Ahli perhitungan kuantitatif elektrokimia dan Hukum Faraday',
    status: 'prerequisite_locked',
    statusLabel: 'Belum Tersedia — Terkunci (Tahap Bab 4)',
    color: '#7C3AED',
    accentColor: '#F5F3FF',
    iconName: 'Calculator',
    milestonePhase: 'Milestone 5',
  },
  {
    id: 5,
    chapterNumber: 5,
    title: 'Penerapan & Evaluasi Akhir',
    tagline: 'Penyepuhan Logam (Electroplating), Pemurnian Logam, & Ujian Akhir',
    description: 'Aplikasi industri elektrokimia: pelapisan logam anti-korosi, pemurnian tembaga, diakhiri dengan evaluasi komprehensif 4 level penguasaan.',
    competencies: [
      'Menganalisis prinsip penyepuhan logam (benda di katode, logam pelapis di anode)',
      'Menjelaskan proses pemurnian tembaga kasar (blister copper)',
      'Mengevaluasi kompetensi komprehensif melalui bank soal bertahap',
    ],
    subtopics: [
      { id: '5.1', title: '5.1 Penyepuhan Logam (Electroplating)', type: 'concept', duration: '12 mnt', description: 'Pelapisan logam mulia' },
      { id: '5.2', title: '5.2 Pemurnian Logam dan Produksi Zat', type: 'concept', duration: '12 mnt', description: 'Pemurnian industri tembaga' },
      { id: '5.3', title: 'Ujian Komprehensif Sel Elektrolisis', type: 'exam', duration: '30 mnt', description: 'Evaluasi akhir 4 level dan perolehan sertifikat lencana' },
    ],
    badgeName: 'Ilmuwan Elektrokimia',
    badgeDescription: 'Lulus evaluasi komprehensif seluruh modul sel elektrolisis',
    status: 'prerequisite_locked',
    statusLabel: 'Belum Tersedia — Terkunci (Tahap Bab 5)',
    color: '#EA580C',
    accentColor: '#FFF7ED',
    iconName: 'Award',
    milestonePhase: 'Milestone 6',
  },
];
