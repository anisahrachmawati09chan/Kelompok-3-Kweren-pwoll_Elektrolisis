import { useState } from 'react';
import { Sidebar } from './components/dashboard/Sidebar';
import { TopNavbar } from './components/dashboard/TopNavbar';
import { WelcomeBanner } from './components/dashboard/WelcomeBanner';
import { LearningCardsRow } from './components/dashboard/LearningCardsRow';
import { QuickAppsGrid } from './components/dashboard/QuickAppsGrid';
import { ChemistryStatsWidget } from './components/dashboard/ChemistryStatsWidget';
import { LabSheetModal } from './features/home/LabSheetModal';
import { LoginScreen } from './components/auth/LoginScreen';
import { AskTeacherView } from './features/teacher/AskTeacherView';
import { HelpModal } from './components/help/HelpModal';
import type { StudentProfile } from './components/auth/LoginScreen';
import { Lock } from 'lucide-react';

const STORAGE_KEY_STUDENT = 'chemverse_logged_student_v1';

/**
 * ChemVerse App - Modern Learning Dashboard
 * Fitur:
 * 1. LoginScreen di awal (meminta Nama & Kelas siswa).
 * 2. Beranda Utama dengan tombol rumah (Home) aktif.
 * 3. Menu 'Tanya dengan Guru' (Konsultasi langsung dengan guru kimia).
 * 4. Menu 'Bantuan' yang menampilkan daftar email & kontak pendiri website.
 * 5. Lembar kerja laboratorium interaktif Modul 1.
 */
function App() {
  // State profil siswa yang login
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem(STORAGE_KEY_STUDENT);
        if (saved) return JSON.parse(saved);
      }
    } catch {
      // Fallback jika localStorage tidak tersedia
    }
    return null;
  });

  // State navigasi tab sidebar: 'home' | 'modules' | 'teacher' | 'history' | 'help'
  const [activeTab, setActiveTab] = useState<string>('home');

  // State pencarian konsep di topbar
  const [searchQuery, setSearchQuery] = useState<string>('');

  // State modal lembar kerja laboratorium Modul 1
  const [isLabSheetOpen, setIsLabSheetOpen] = useState<boolean>(false);

  // State modal bantuan & kontak pendiri
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);

  // Subtopik yang dipilih saat modal lembar kerja dibuka
  const [selectedSubtopicId, setSelectedSubtopicId] = useState<string>('1.1');

  // Topik awal untuk menu Tanya Guru (jika diarahkan dari lembar belajar)
  const [teacherTopic, setTeacherTopic] = useState<string | undefined>(undefined);

  // State pesan toast notifikasi sementara
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  /**
   * Menampilkan pesan notifikasi melayang sementara
   */
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  /**
   * Handler saat siswa menekan tombol masuk pada LoginScreen
   */
  const handleLogin = (profile: StudentProfile) => {
    setStudentProfile(profile);
    setActiveTab('home');
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY_STUDENT, JSON.stringify(profile));
      }
    } catch (err) {
      console.warn('Gagal menyimpan profil siswa ke storage:', err);
    }
  };

  /**
   * Handler untuk keluar / berganti siswa
   */
  const handleLogout = () => {
    setStudentProfile(null);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(STORAGE_KEY_STUDENT);
      }
    } catch (err) {
      console.warn('Gagal menghapus profil dari storage:', err);
    }
    triggerToast('Anda telah keluar. Silakan masukkan nama siswa.');
  };

  /**
   * Membuka lembar kerja laboratorium pada subtopik tertentu
   */
  const handleOpenStudySheet = (subtopicId: string = '1.1') => {
    setSelectedSubtopicId(subtopicId);
    setIsLabSheetOpen(true);
  };

  /**
   * Membuka menu Tanya Guru dengan topik materi tertentu
   */
  const handleOpenTeacherWithTopic = (topicTitle: string) => {
    setIsLabSheetOpen(false);
    setTeacherTopic(topicTitle);
    setActiveTab('teacher');
    triggerToast(`Beralih ke Tanya Guru: Topik "${topicTitle}" terpilih.`);
  };

  // JIKA SISWA BELUM LOGIN: Tampilkan Layar Masuk Nama & Kelas
  if (!studentProfile) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        defaultName=""
        defaultClass="Kelas 12 IPA 1"
      />
    );
  }

  // JIKA SISWA SUDAH LOGIN: Tampilkan Dashboard
  return (
    <div className="dashboard-layout">
      {/* 1. Sidebar Navigasi Kiri (Deep Indigo) */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tabId) => {
          if (tabId === 'help') {
            setIsHelpModalOpen(true);
            return;
          }
          if (tabId === 'modules') {
            handleOpenStudySheet('1.1');
            return;
          }
          if (tabId === 'history') {
            triggerToast('Riwayat Belajar: Modul 1 Sel Elektrolisis (100% Siap Belajar).');
            return;
          }
          setActiveTab(tabId);
        }}
        onLogout={handleLogout}
      />

      {/* 2. Area Konten Utama Dashboard */}
      <main className="dashboard-main">
        {/* Top Navbar dengan Search Bar Pill, Tombol Tanya Guru, Bantuan, & Profil */}
        <TopNavbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenStudySheet={() => handleOpenStudySheet('1.1')}
          studentProfile={studentProfile}
          onLogout={handleLogout}
          onOpenTeacher={() => setActiveTab('teacher')}
          onOpenHelp={() => setIsHelpModalOpen(true)}
        />

        {/* KONTEN BERDASARKAN TAB AKTIF */}
        {activeTab === 'teacher' ? (
          /* Tampilan Menu: Tanya dengan Guru */
          <AskTeacherView
            studentProfile={studentProfile}
            onBackToHome={() => setActiveTab('home')}
            initialTopic={teacherTopic}
            onOpenHelp={() => setIsHelpModalOpen(true)}
          />
        ) : (
          /* Tampilan Beranda Utama */
          <>
            {/* Baris 1: Banner Sambutan Peach dengan Nama Siswa yang Login */}
            <WelcomeBanner
              studentName={studentProfile.name}
              onStartLearning={() => handleOpenStudySheet('1.1')}
            />

            {/* Baris 2: Bagian Belajar Utama Modul 1 */}
            <LearningCardsRow
              onSelectSubtopic={(subId) => handleOpenStudySheet(subId)}
              onSeeAll={() => handleOpenStudySheet('1.1')}
            />

            {/* Baris 3: Menu Bimbingan (Tanya Guru, Bantuan, Modul Lanjutan) + Statistik Kimia */}
            <div className="bottom-sections-row">
              <QuickAppsGrid
                onOpenStudySheet={(subId) => handleOpenStudySheet(subId)}
                onLockedClick={(title) =>
                  triggerToast(`${title} berstatus BELUM TERSEDIA — Selesaikan Bab 1 terlebih dahulu sesuai PRD.`)
                }
                onOpenTeacher={() => setActiveTab('teacher')}
                onOpenHelp={() => setIsHelpModalOpen(true)}
              />

              {/* Kanan: Widget Statistik Kimia */}
              <ChemistryStatsWidget />
            </div>
          </>
        )}
      </main>

      {/* 3. Lembar Kerja Laboratorium Interaktif (Modal View) */}
      {isLabSheetOpen && (
        <LabSheetModal
          initialSubtopicId={selectedSubtopicId}
          onClose={() => setIsLabSheetOpen(false)}
          onAskTeacher={handleOpenTeacherWithTopic}
        />
      )}

      {/* 4. Modal Bantuan & Email Pendiri Website (Kelompok 3) */}
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        onOpenTeacherView={() => {
          setIsHelpModalOpen(false);
          setActiveTab('teacher');
        }}
      />

      {/* 5. Notifikasi Toast Sementara */}
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
