/**
 * Student Records Store & Excel Export Helper
 * Menyimpan data riwayat login dan nilai latihan siswa untuk dipantau oleh guru.
 */

export interface StudentRecord {
  id: string;
  name: string;
  className: string;
  loginTime: string;
  score: number;
  maxScore: number;
  status: 'Sedang Belajar' | 'Selesai Latihan';
  completedQuestionsCount: number;
}

export interface StudentProfile {
  role: 'student';
  name: string;
  className: string;
}

export interface TeacherProfile {
  role: 'teacher';
  name: string;
  title: string;
}

export type UserProfile = StudentProfile | TeacherProfile;

const STORAGE_KEY_STUDENTS = 'chemverse_students_list_v2';

const INITIAL_STUDENT_RECORDS: StudentRecord[] = [
  {
    id: 'std-1',
    name: 'Elsa Rasengraffe',
    className: 'Kelas 12 IPA 1',
    loginTime: '2026-11-10 08:15',
    score: 4,
    maxScore: 4,
    status: 'Selesai Latihan',
    completedQuestionsCount: 4,
  },
  {
    id: 'std-2',
    name: 'Ahmad Fauzi',
    className: 'Kelas 12 IPA 2',
    loginTime: '2026-11-10 09:30',
    score: 3,
    maxScore: 4,
    status: 'Selesai Latihan',
    completedQuestionsCount: 4,
  },
  {
    id: 'std-3',
    name: 'Siti Rahmawati',
    className: 'Kelas 12 IPA 1',
    loginTime: '2026-11-10 10:05',
    score: 2,
    maxScore: 4,
    status: 'Sedang Belajar',
    completedQuestionsCount: 2,
  },
  {
    id: 'std-4',
    name: 'Budi Santoso',
    className: 'Fase F - Kimia 1',
    loginTime: '2026-11-10 11:20',
    score: 4,
    maxScore: 4,
    status: 'Selesai Latihan',
    completedQuestionsCount: 4,
  },
];

export const studentRecordStore = {
  getAll(): StudentRecord[] {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = localStorage.getItem(STORAGE_KEY_STUDENTS);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      }
    } catch (err) {
      console.warn('Gagal memuat rekam siswa:', err);
    }
    return INITIAL_STUDENT_RECORDS;
  },

  recordLogin(name: string, className: string): StudentRecord[] {
    const list = this.getAll();
    const existingIndex = list.findIndex(
      (s) => s.name.toLowerCase() === name.toLowerCase() && s.className === className
    );

    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
      2,
      '0'
    )}`;

    if (existingIndex >= 0) {
      list[existingIndex].loginTime = timeStr;
    } else {
      list.unshift({
        id: `std-${Date.now()}`,
        name,
        className,
        loginTime: timeStr,
        score: 0,
        maxScore: 4,
        status: 'Sedang Belajar',
        completedQuestionsCount: 0,
      });
    }

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(list));
      }
    } catch (err) {
      console.warn('Gagal menyimpan rekam siswa:', err);
    }

    return list;
  },

  updateScore(name: string, score: number, maxScore: number = 4): StudentRecord[] {
    const list = this.getAll();
    const existing = list.find((s) => s.name.toLowerCase() === name.toLowerCase());

    if (existing) {
      existing.score = score;
      existing.maxScore = maxScore;
      existing.completedQuestionsCount = Math.max(existing.completedQuestionsCount, score);
      existing.status = score >= maxScore ? 'Selesai Latihan' : 'Sedang Belajar';

      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(list));
        }
      } catch (err) {
        console.warn('Gagal memperbarui nilai siswa:', err);
      }
    }

    return list;
  },
};

/**
 * Fungsi untuk mengunduh rekapitulasi data dan nilai siswa ke berkas CSV yang ramah Microsoft Excel.
 * Menggunakan UTF-8 BOM (\uFEFF) dan pemisah titik koma/koma agar format karakter dan tabel rapi di Excel.
 */
export function exportStudentsToExcel(students: StudentRecord[]): void {
  const headers = [
    'No',
    'Nama Siswa',
    'Kelas',
    'Waktu Login Terakhir',
    'Skor Diperoleh',
    'Skor Maksimal',
    'Persentase Nilai',
    'Status Pengerjaan',
  ];

  const rows = students.map((s, idx) => {
    const percent = Math.round((s.score / (s.maxScore || 1)) * 100);
    return [
      idx + 1,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.className.replace(/"/g, '""')}"`,
      `"${s.loginTime}"`,
      s.score,
      s.maxScore,
      `"${percent}%"`,
      `"${s.status}"`,
    ];
  });

  const csvContent =
    '\uFEFF' +
    [headers.join(';'), ...rows.map((row) => row.join(';'))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `Rekap_Nilai_Siswa_ChemVerse_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

