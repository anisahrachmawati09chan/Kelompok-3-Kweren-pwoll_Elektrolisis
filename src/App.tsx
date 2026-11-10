import { useState } from 'react';
import { Sidebar } from './components/dashboard/Sidebar';
import { TopNavbar } from './components/dashboard/TopNavbar';
import { WelcomeBanner } from './components/dashboard/WelcomeBanner';
import { LearningCardsRow } from './components/dashboard/LearningCardsRow';
import { QuickAppsGrid } from './components/dashboard/QuickAppsGrid';
import { ChemistryStatsWidget } from './components/dashboard/ChemistryStatsWidget';
import { LabSheetModal } from './features/home/LabSheetModal';
import { LoginScreen } from './components/auth/LoginScreen';
import { TeacherDashboard } from './features/teacher/TeacherDashboard';
import type { UserProfile, StudentRecord } from './utils/studentRecords';
import { studentRecordStore } from './utils/studentRecords';
import type { QuizQuestion } from './data/questionsData';
import { questionStore } from './data/questionsData';
import { Lock, BookOpen } from 'lucide-react';

const STORAGE_KEY_USER = 'chemverse_active_user_v2';

/**
 * ChemVerse App - Modern Chemistry Learning Platform
 * Mendukung 2 Peran Utama:
 * 1. Akun Siswa: Mengakses beranda belajar, mengerjakan kuis 1.4, nilai otomatis tersimpan.
 * 2. Akun Guru: Mengakses Dashboard Guru (melihat data siswa, export ke Excel, menambah & mengubah soal).
 */
function App() {
  // State profil pengguna yang aktif (Siswa atau Guru)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem(STORAGE_KEY_USER);
        if (saved) return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return null;
  });

  // State tampilan khusus guru: 'dashboard' atau 'student_preview'
  const [teacherViewMode, setTeacherViewMode] = useState<'dashboard' | 'student_preview'>('dashboard');

  // State daftar siswa dan skor latihan
  const [students, setStudents] = useState<StudentRecord[]>(() => studentRecordStore.getAll());

  // State bank soal kuis dinamis
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => questionStore.getQuestions());

  // State tab sidebar beranda siswa
  const [activeTab, setActiveTab] = useState<string>('home');

  // State pencarian konsep di topbar
  const [searchQuery, setSearchQuery] = useState<string>('');

  // State modal lembar kerja laboratorium Modul 1
  const [isLabSheetOpen, setIsLabSheetOpen] = useState<boolean>(false);
  const [selectedSubtopicId, setSelectedSubtopicId] = useState<string>('1.1');

  // State notifikasi toast melayang
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  /**
   * Handler Login Siswa atau Guru
   */
  const handleLogin = (profile: UserProfile) => {
    setUserProfile(profile);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
      }
    } catch (err) {
      console.warn('Gagal menyimpan profil login:', err);
    }

    if (profile.role === 'student') {
      // Rekam login siswa ke database lokal untuk guru
      const updated = studentRecordStore.recordLogin(profile.name, profile.className);
      setStudents(updated);
      setActiveTab('home');
      triggerToast(`Selamat datang, ${profile.name}!`);
    } else {
      // Masuk ke dashboard guru
      setTeacherViewMode('dashboard');
      triggerToast(`Selamat datang di Panel Guru, ${profile.name}!`);
    }
  };

  /**
   * Handler Logout
   */
  const handleLogout = () => {
    setUserProfile(null);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (err) {
      console.warn('Gagal menghapus profil dari storage:', err);
    }
    triggerToast('Anda telah keluar. Silakan pilih akun masuk.');
  };

  /**
   * Handler saat siswa memperoleh skor baru di LabSheetModal
   */
  const handleStudentScoreUpdate = (score: number, maxScore: number) => {
    if (userProfile && userProfile.role === 'student') {
      const updated = studentRecordStore.updateScore(userProfile.name, score, maxScore);
      setStudents(updated);
    }
  };

  /**
   * Handler Guru: Simpan perubahan soal (Tambah / Edit / Hapus)
   */
  const handleSaveQuestions = (newQuestions: QuizQuestion[]) => {
    setQuestions(newQuestions);
    questionStore.saveQuestions(newQuestions);
    triggerToast('Bank soal berhasil diperbarui!');
  };

  /**
   * Handler Guru: Reset ke soal standar PRD
   */
  const handleResetQuestions = () => {
    const defaultList = questionStore.resetToDefault();
    setQuestions(defaultList);
    triggerToast('Bank soal dikembalikan ke 4 soal standar Kurikulum Merdeka.');
  };

  const handleOpenStudySheet = (subtopicId: string = '1.1') => {
    setSelectedSubtopicId(subtopicId);
    setIsLabSheetOpen(true);
  };

  // 1. JIKA BELUM LOGIN: Tampilkan Layar Pilihan Masuk (Siswa / Guru)
  if (!userProfile) {
    return <LoginScreen onLogin={handleLogin} defaultClass="Kelas 12 IPA 1" />;
  }

  // 2. JIKA GURU MEMBUKA DASHBOARD GURU:
  if (userProfile.role === 'teacher' && teacherViewMode === 'dashboard') {
    return (
      <div className="app-teacher-root">
        <TeacherDashboard
          teacherProfile={userProfile}
          students={students}
          questions={questions}
          onSaveQuestions={handleSaveQuestions}
          onResetQuestions={handleResetQuestions}
          onOpenStudentView={() => setTeacherViewMode('student_preview')}
          onLogout={handleLogout}
        />

        {toastMessage && (
          <div className="dash-toast" role="alert">
            <Lock size={16} className="dash-toast-icon" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  // 3. JIKA SISWA ATAU GURU SEDANG PRATINJAU SISWA:
  const isTeacherPreview = userProfile.role === 'teacher' && teacherViewMode === 'student_preview';

  return (
    <div className="dashboard-layout">
      {/* Banner Notifikasi jika Guru sedang dalam Mode Pratinjau Siswa */}
      {isTeacherPreview && (
        <div className="teacher-preview-banner">
          <span>Anda sedang melihat tampilan siswa sebagai <strong>{userProfile.name}</strong>.</span>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={() => setTeacherViewMode('dashboard')}
          >
            <BookOpen size={14} />
            <span>Kembali ke Dashboard Guru</span>
          </button>
        </div>
      )}

      {/* 1. Sidebar Navigasi Kiri */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tabId) => {
          if (tabId === 'teacher' && userProfile.role === 'teacher') {
            setTeacherViewMode('dashboard');
            return;
          }
          setActiveTab(tabId);
          if (tabId === 'help') {
            handleOpenStudySheet('1.1');
          }
        }}
        onLogout={handleLogout}
        isTeacher={userProfile.role === 'teacher'}
      />

      {/* 2. Area Konten Utama Beranda Siswa */}
      <main className="dashboard-main">
        {/* Topbar dengan Search & Profil Akun */}
        <TopNavbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenStudySheet={() => handleOpenStudySheet('1.1')}
          userProfile={userProfile}
          onLogout={handleLogout}
          onOpenTeacherDashboard={
            userProfile.role === 'teacher' ? () => setTeacherViewMode('dashboard') : undefined
          }
        />

        {/* Banner Sambutan Personalisasi */}
        <WelcomeBanner
          studentName={userProfile.name}
          onStartLearning={() => handleOpenStudySheet('1.1')}
        />

        {/* 4 Kartu Bagian Belajar Utama */}
        <LearningCardsRow
          onSelectSubtopic={(subId) => handleOpenStudySheet(subId)}
          onSeeAll={() => handleOpenStudySheet('1.1')}
        />

        {/* Baris Bawah: Modul Lanjutan & Statistik Kimia */}
        <div className="bottom-sections-row">
          <QuickAppsGrid
            onOpenStudySheet={(subId) => handleOpenStudySheet(subId)}
            onLockedClick={(title) =>
              triggerToast(`${title} berstatus BELUM TERSEDIA — Selesaikan Bab 1 terlebih dahulu sesuai PRD.`)
            }
          />
          <ChemistryStatsWidget />
        </div>
      </main>

      {/* 3. Lembar Belajar Laboratorium Interaktif (Dengan Bank Soal Dinamis & Catat Nilai) */}
      {isLabSheetOpen && (
        <LabSheetModal
          initialSubtopicId={selectedSubtopicId}
          onClose={() => setIsLabSheetOpen(false)}
          questions={questions}
          onScoreUpdate={handleStudentScoreUpdate}
        />
      )}

      {/* 4. Notifikasi Toast */}
      {toastMessage && (
        <div className="dash-toast" role="alert">
          <Lock size={16} className="dash-toast-icon" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
