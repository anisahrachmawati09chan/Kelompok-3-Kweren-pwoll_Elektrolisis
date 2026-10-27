/**
 * Course Syllabus and Roadmap Data for ElectroLab
 * Strictly adhering to PRD.md & Kurikulum Merdeka Fase F Kimia SMA Kelas 12
 */

export interface Subtopic {
  id: string;
  title: string;
  type: 'concept' | 'simulator' | 'calculator' | 'quiz' | 'exam';
  duration: string;
  description: string;
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
    tagline: 'Konsep Redoks, Sel Volta vs Sel Elektrolisis, dan Komponen',
    description: 'Pahami perbedaan mendasar sel volta dan sel elektrolisis, perpindahan elektron, serta aturan polaritas elektroda (Katode = Reduksi, Anode = Oksidasi).',
    competencies: [
      'Membedakan transfer energi sel volta dan sel elektrolisis',
      'Mengidentifikasi kutub katode (-) dan anode (+)',
      'Memahami konsep oksidasi sebagai pelepasan elektron dan reduksi penerimaan elektron',
    ],
    subtopics: [
      { id: '1.1', title: '1.1 Reaksi Oksidasi dan Reduksi', type: 'concept', duration: '10 mnt', description: 'Konsep transfer elektron dan bilangan oksidasi' },
      { id: '1.2', title: '1.2 Sel Volta vs Sel Elektrolisis', type: 'concept', duration: '12 mnt', description: 'Perbandingan spontanitas, kutub, dan arah energi' },
      { id: '1.3', title: '1.3 Komponen Utama Sel Elektrolisis', type: 'concept', duration: '10 mnt', description: 'Sumber arus DC, wadah, elektrolit, dan elektroda' },
      { id: '1.4', title: 'Kuis Cek Pemahaman Bab 1', type: 'quiz', duration: '15 mnt', description: 'Tes formatif Level 1 pengenalan konsep dan terminologi' },
    ],
    badgeName: 'Penjelajah Redoks',
    badgeDescription: 'Menguasai konsep dasar redoks dan perbandingan sel elektrokimia',
    status: 'available',
    color: '#0284C7',
    accentColor: '#E0F2FE',
    iconName: 'Zap',
    milestonePhase: 'Milestone 2',
  },
  {
    id: 2,
    chapterNumber: 2,
    title: 'Cara Kerja Sel Elektrolisis',
    tagline: 'Rangkaian Listrik DC, Aliran Elektron, dan Migrasi Ion',
    description: 'Amati aliran elektron pada rangkaian kawat luar dan bagaimana ion menghantarkan muatan di dalam larutan (kation ke katode, anion ke anode) tanpa elektron bebas dalam larutan.',
    competencies: [
      'Menelusuri arah aliran elektron dari anode menuju katode melalui kawat',
      'Menjelaskan migrasi kation menuju katode dan anion menuju anode',
      'Mengoperasikan simulator rangkaian dengan tombol kontrol dinamis',
    ],
    subtopics: [
      { id: '2.1', title: '2.1 Sumber Arus Searah dan Rangkaian', type: 'concept', duration: '10 mnt', description: 'Peran baterai/adaptor DC mendorong perpindahan muatan' },
      { id: '2.2', title: '2.2 Katode, Anode, Kation, dan Anion', type: 'concept', duration: '12 mnt', description: 'Pasangan elektroda dan muatan ion yang tertarik' },
      { id: '2.3', title: '2.3 Arah Aliran Elektron dan Migrasi Ion', type: 'concept', duration: '10 mnt', description: 'Fakta bahwa elektron tidak mengalir bebas di larutan' },
      { id: '2.4', title: 'Simulator Rangkaian Sel Elektrolisis', type: 'simulator', duration: '15 mnt', description: 'Interaksi wadah, elektroda, dan partikel animasi' },
      { id: '2.5', title: 'Kuis Cek Pemahaman Bab 2', type: 'quiz', duration: '15 mnt', description: 'Evaluasi alur muatan dan identifikasi komponen' },
    ],
    badgeName: 'Ahli Elektroda',
    badgeDescription: 'Memahami rangkaian listrik dan pergerakan partikel ionik',
    status: 'available',
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
    description: 'Tentukan reaksi reduksi di katode dan oksidasi di anode berdasarkan kompetisi ion, potensial reduksi, jenis pelarut air, serta bahan elektroda.',
    competencies: [
      'Membedakan elektrolisis lelehan murni tanpa air dengan larutan berair',
      'Menentukan kompetisi reduksi kation vs reduksi air di katode',
      'Menentukan kompetisi oksidasi anion vs oksidasi air / elektroda aktif di anode',
      'Menuliskan persamaan setengah reaksi dan reaksi total yang setara',
    ],
    subtopics: [
      { id: '3.1', title: '3.1 Elektrolisis Lelehan (Tanpa Air)', type: 'concept', duration: '12 mnt', description: 'Skenario NaCl leleh membentuk Na(l) dan Cl2(g)' },
      { id: '3.2', title: '3.2 Larutan Berair dengan Elektroda Inert', type: 'concept', duration: '15 mnt', description: 'Kompetisi H2O vs ion logam aktif atau asam oksi' },
      { id: '3.3', title: '3.3 Elektrolisis dengan Elektroda Aktif', type: 'concept', duration: '12 mnt', description: 'Reaksi anode Cu melarut pada larutan CuSO4' },
      { id: '3.4', title: 'Laboratorium Virtual Produk Elektrolisis', type: 'simulator', duration: '20 mnt', description: 'Eksperimen virtual pemilihan zat dan analisis produk' },
      { id: '3.5', title: 'Kuis Cek Pemahaman Bab 3', type: 'quiz', duration: '15 mnt', description: 'Uji penyusunan persamaan reaksi setara atom & muatan' },
    ],
    badgeName: 'Analis Produk Elektrolisis',
    badgeDescription: 'Mampu memprediksi spesies yang bereaksi di kedua elektroda',
    status: 'available',
    color: '#0D9488',
    accentColor: '#F0FDFA',
    iconName: 'FlaskConical',
    milestonePhase: 'Milestone 4',
  },
  {
    id: 4,
    chapterNumber: 4,
    title: 'Kalkulator Hukum Faraday',
    tagline: 'Perhitungan Muatan Listrik, Mol Elektron, dan Massa Zat',
    description: 'Terapkan Hukum Faraday I dan II untuk menghitung muatan listrik Q = I × t, mol elektron n(e⁻) = Q/F, serta massa zat m = (M × I × t) / (z × F) dengan F = 96.485 C/mol.',
    competencies: [
      'Menghubungkan arus dan waktu dengan muatan listrik (Coulomb)',
      'Mengonversi muatan menjadi mol elektron menggunakan tetapan Faraday 96.485 C/mol',
      'Menghitung massa endapan logam atau volume gas berdasarkan stoikiometri reaksi',
    ],
    subtopics: [
      { id: '4.1', title: '4.1 Muatan Listrik, Arus, dan Waktu', type: 'concept', duration: '10 mnt', description: 'Korelasi Q = I × t dengan ampere dan sekon' },
      { id: '4.2', title: '4.2 Hubungan Muatan dengan Mol Elektron', type: 'concept', duration: '12 mnt', description: 'Makna 1 Faraday setara 1 mol elektron' },
      { id: '4.3', title: '4.3 Perhitungan Massa Endapan & Gas', type: 'concept', duration: '15 mnt', description: 'Substitusi rumus kuantitatif m = (M·I·t)/(z·F)' },
      { id: '4.4', title: 'Kalkulator Interaktif Hukum Faraday', type: 'calculator', duration: '15 mnt', description: 'Perhitungan bertahap dengan langkah kalkulasi transparan' },
      { id: '4.5', title: 'Kuis Soal Hitungan Bab 4', type: 'quiz', duration: '20 mnt', description: 'Latihan hitungan Level 4 dengan toleransi desimal' },
    ],
    badgeName: 'Master Hukum Faraday',
    badgeDescription: 'Ahli stoikiometri elektrokimia kuantitatif dan Hukum Faraday',
    status: 'available',
    color: '#7C3AED',
    accentColor: '#F5F3FF',
    iconName: 'Calculator',
    milestonePhase: 'Milestone 5',
  },
  {
    id: 5,
    chapterNumber: 5,
    title: 'Penerapan & Evaluasi Akhir',
    tagline: 'Penyepuhan Logam (Electroplating), Pemurnian, & Ujian Akhir',
    description: 'Pelajari aplikasi dunia nyata sel elektrolisis dalam industri seperti pelapisan logam anti-karat dan pemurnian tembaga, diakhiri dengan evaluasi komprehensif.',
    competencies: [
      'Menganalisis prinsip penyepuhan logam (benda dilapisi di katode, logam pelapis di anode)',
      'Menjelaskan pemurnian logam tembaga (blister copper)',
      'Mengevaluasi penguasaan materi secara menyeluruh melalui bank soal adaptif',
    ],
    subtopics: [
      { id: '5.1', title: '5.1 Penyepuhan Logam (Electroplating)', type: 'concept', duration: '12 mnt', description: 'Aplikasi pelapisan emas/perak/krom pada perhiasan dan otomotif' },
      { id: '5.2', title: '5.2 Pemurnian Logam dan Produksi Zat', type: 'concept', duration: '12 mnt', description: 'Pemurnian tembaga anodik dan isolasi gas klorin / NaOH' },
      { id: '5.3', title: '5.3 Analisis Data Percobaan Laboratorium', type: 'concept', duration: '15 mnt', description: 'Interpretasi data massa elektroda dan volume gas hasil uji' },
      { id: '5.4', title: 'Ujian Komprehensif Sel Elektrolisis', type: 'exam', duration: '30 mnt', description: 'Evaluasi akhir 4 level dengan rekomendasi belajar khusus' },
    ],
    badgeName: 'Ilmuwan Elektrokimia',
    badgeDescription: 'Lulus evaluasi komprehensif seluruh modul sel elektrolisis',
    status: 'available',
    color: '#EA580C',
    accentColor: '#FFF7ED',
    iconName: 'Award',
    milestonePhase: 'Milestone 6',
  },
];

export const CORE_PILLARS = [
  {
    id: 'simulator',
    title: 'Simulator Rangkaian & Partikel',
    icon: 'Activity',
    badge: 'Interaktif Bab 2',
    description: 'Visualisasikan aliran elektron di kawat luar dan migrasi kation/anion di larutan. Dilengkapi tombol Mulai, Jeda, dan penjelasan interaktif komponen.',
    highlight: 'Elektron tidak bergerak bebas di larutan',
  },
  {
    id: 'products',
    title: 'Lab Prediksi Produk Reaksi',
    icon: 'FlaskConical',
    badge: 'Virtual Lab Bab 3',
    description: 'Eksperimen dengan berbagai kombinasi elektrolit (lelehan NaCl, larutan CuSO₄, NaCl) dan elektroda (inert Pt/C atau aktif Cu).',
    highlight: 'Persamaan setengah reaksi setara atom & muatan',
  },
  {
    id: 'faraday',
    title: 'Kalkulator Hukum Faraday',
    icon: 'Calculator',
    badge: 'Kuantitatif Bab 4',
    description: 'Hitung muatan Q, mol elektron, massa endapan, dan volume gas secara transparan dengan tetapan Faraday F = 96.485 C/mol beserta langkah substitusi.',
    highlight: 'Langkah perhitungan sistematis',
  },
  {
    id: 'evaluation',
    title: 'Arena Evaluasi & Gamifikasi',
    icon: 'Award',
    badge: 'Evaluasi Bab 1-5',
    description: 'Latihan 4 level dengan umpan balik instan, petunjuk konsep bertahap, perolehan XP, dan lencana prestasi kimia Kurikulum Merdeka.',
    highlight: 'Umpan balik langsung & pembahasan',
  },
];
