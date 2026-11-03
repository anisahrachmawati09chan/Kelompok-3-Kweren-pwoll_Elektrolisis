import { useState } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './features/home/HeroSection';
import { Module1Card } from './features/home/Module1Card';
import { UpcomingModules } from './features/home/UpcomingModules';
import { LabSheetModal } from './features/home/LabSheetModal';
import { CHAPTERS_DATA } from './data/courseData';

/**
 * Komponen Utama Aplikasi ChemVerse
 * Dirancang khusus agar mudah dipahami oleh yang baru belajar React:
 * 1. Menggunakan useState sederhana untuk mengontrol modal lembar belajar.
 * 2. Struktur komponen tersusun rapi dari Header, Konten Utama, hingga Footer.
 * 3. 100% bebas biaya & tanpa perlu login/identitas siswa.
 */
function App() {
  // State untuk mengontrol apakah lembar belajar laboratorium (Modal) terbuka
  const [isLabSheetOpen, setIsLabSheetOpen] = useState<boolean>(false);

  // State untuk menentukan subtopik mana yang langsung aktif saat lembar dibuka (1.1, 1.2, dst.)
  const [selectedSubtopicId, setSelectedSubtopicId] = useState<string>('1.1');

  // Modul 1 adalah modul pertama dalam kurikulum elektrokimia
  const module1 = CHAPTERS_DATA[0];

  /**
   * Fungsi untuk membuka lembar belajar modul 1
   * @param subtopicId Opsional: ID subtopik yang ingin dibuka langsung
   */
  const handleOpenStudySheet = (subtopicId: string = '1.1') => {
    setSelectedSubtopicId(subtopicId);
    setIsLabSheetOpen(true);
  };

  /**
   * Fungsi untuk menutup lembar belajar dan kembali ke beranda
   */
  const handleCloseStudySheet = () => {
    setIsLabSheetOpen(false);
  };

  return (
    <div className="chemverse-app">
      {/* 1. Header Laboratorium Akademis */}
      <Header onOpenModule1={() => handleOpenStudySheet('1.1')} />

      {/* 2. Konten Utama Beranda */}
      <main id="main-content">
        {/* Bagian Hero: Judul, Sasaran Pengguna SMA/Guru, Penjelasan Elektrolisis & Aturan Emas */}
        <HeroSection onStartLearning={() => handleOpenStudySheet('1.1')} />

        {/* Bagian Modul 1: Kartu Fokus Beranda dengan Bagian Belajar 1.1 - 1.4 */}
        <Module1Card
          module={module1}
          onOpenStudySheet={handleOpenStudySheet}
        />

        {/* Bagian Rencana Modul Lanjutan: Bab 2 - Bab 5 dengan Keterangan Jelas "Belum Tersedia" */}
        <UpcomingModules chapters={CHAPTERS_DATA} />
      </main>

      {/* 3. Footer Akademis Bebas Biaya & Tanpa Pengumpulan Data Siswa */}
      <Footer />

      {/* 4. Lembar Belajar Laboratorium Interaktif (Modal View) */}
      {isLabSheetOpen && (
        <LabSheetModal
          initialSubtopicId={selectedSubtopicId}
          onClose={handleCloseStudySheet}
        />
      )}
    </div>
  );
}

export default App;
