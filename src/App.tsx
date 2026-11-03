import { useState } from 'react';
import { Sidebar } from './components/dashboard/Sidebar';
import { TopNavbar } from './components/dashboard/TopNavbar';
import { WelcomeBanner } from './components/dashboard/WelcomeBanner';
import { LearningCardsRow } from './components/dashboard/LearningCardsRow';
import { QuickAppsGrid } from './components/dashboard/QuickAppsGrid';
import { ChemistryStatsWidget } from './components/dashboard/ChemistryStatsWidget';
import { LabSheetModal } from './features/home/LabSheetModal';
import { LoginScreen } from './components/auth/LoginScreen';
import type { StudentProfile } from './components/auth/LoginScreen';
import { Lock } from 'lucide-react';

const STORAGE_KEY_STUDENT = 'chemverse_logged_student_v1';

/**
 * ChemVerse App - Modern Learning Dashboard
 * Alur Kerja:
 * 1. Menampilkan LoginScreen di awal (meminta Nama & Kelas siswa).
 * 2. Setelah masuk, berpindah ke Beranda Utama dengan tombol rumah (Home) aktif.
 * 3. Banner 'Selamat Belajar, [Nama]!' menyesuaikan secara dinamis dengan nama siswa.
 * 4. Profil di pojok kanan atas menampilkan nama lengkap, kelas, dan inisial avatar siswa.
 * 5. Siswa dapat keluar / berganti akun kapan saja melalui tombol di sidebar atau menu profil.
 */
function App() {
  // State profil siswa yang login (dibaca dari localStorage agar tetap tersimpan saat refresh)
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

  // State navigasi tab sidebar: default 'home' (gambar tombol rumah) saat masuk beranda
  const [activeTab, setActiveTab] = useState<string>('home');

  // State pencarian konsep di topbar
  const [searchQuery, setSearchQuery] = useState<string>('');

  // State modal lembar kerja laboratorium Modul 1
  const [isLabSheetOpen, setIsLabSheetOpen] = useState<boolean>(false);

  // Subtopik yang dipilih saat modal dibuka (1.1, 1.2, 1.3, 1.4)
  const [selectedSubtopicId, setSelectedSubtopicId] = useState<string>('1.1');

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
    setActiveTab('home'); // Masuk ke beranda utama (tombol rumah)
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

  // JIKA SISWA SUDAH LOGIN: Tampilkan Beranda Utama Dashboard
  return (
    <div className="dashboard-layout">
      {/* 1. Sidebar Navigasi Kiri (Warna Deep Indigo & Tombol Rumah) */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tabId) => {
          setActiveTab(tabId);
          if (tabId === 'help') {
            handleOpenStudySheet('1.1');
          }
        }}
        onLogout={handleLogout}
      />

      {/* 2. Area Konten Utama Dashboard */}
      <main className="dashboard-main">
        {/* Top Navbar dengan Search Bar Pill & Profil Siswa yang Sedang Login */}
        <TopNavbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenStudySheet={() => handleOpenStudySheet('1.1')}
          studentProfile={studentProfile}
          onLogout={handleLogout}
        />

        {/* Baris 1: Banner Sambutan Peach dengan Nama Siswa yang Login */}
        <WelcomeBanner
          studentName={studentProfile.name}
          onStartLearning={() => handleOpenStudySheet('1.1')}
        />

        {/* Baris 2: Bagian Belajar Utama Modul 1 (Popular Services Row) */}
        <LearningCardsRow
          onSelectSubtopic={(subId) => handleOpenStudySheet(subId)}
          onSeeAll={() => handleOpenStudySheet('1.1')}
        />

        {/* Baris 3: Other Applications Grid (Kiri) + Chemistry Stats Widget (Kanan) */}
        <div className="bottom-sections-row">
          {/* Kiri: Kapsul Modul Lanjutan ("Belum Tersedia") & Aturan Lab */}
          <QuickAppsGrid
            onOpenStudySheet={(subId) => handleOpenStudySheet(subId)}
            onLockedClick={(title) =>
              triggerToast(`${title} bertatus BELUM TERSEDIA — Selesaikan Bab 1 terlebih dahulu sesuai PRD.`)
            }
          />

          {/* Kanan: Widget Statistik Kimia (Donut Chart & Metrik Kuantitatif) */}
          <ChemistryStatsWidget />
        </div>
      </main>

      {/* 3. Lembar Kerja Laboratorium Interaktif (Modal View) */}
      {isLabSheetOpen && (
        <LabSheetModal
          initialSubtopicId={selectedSubtopicId}
          onClose={() => setIsLabSheetOpen(false)}
        />
      )}

      {/* 4. Notifikasi Toast untuk Modul Terkunci & Sesi */}
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
