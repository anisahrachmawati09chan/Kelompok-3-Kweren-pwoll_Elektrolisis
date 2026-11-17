import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  BookOpen,
  Zap,
  RotateCcw,
  MessageCircle,
  Mail,
  GraduationCap,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Sparkles,
  FlaskConical,
  FileText,
  Search,
} from 'lucide-react';

interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetProgress?: () => void;
  studentName?: string;
}

interface FAQItem {
  id: string;
  category: 'general' | 'features' | 'xp' | 'curriculum';
  question: string;
  answer: string;
}

const FAQ_LIST: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    question: 'Bagaimana cara memulai belajar konsep sel elektrolisis di ChemVerse?',
    answer:
      'Cukup klik tombol "Mulai Belajar" pada banner beranda, atau klik salah satu dari 4 kartu bagian belajar Modul 1 (1.1 Konsep Sel, 1.2 Katode-Anode, 1.3 Lelehan & Larutan, atau 1.4 Cek Pemahaman). Anda akan langsung masuk ke lembar belajar laboratorium interaktif.',
  },
  {
    id: 'faq-2',
    category: 'general',
    question: 'Apakah ChemVerse bisa dibuka di ponsel atau tablet?',
    answer:
      'Ya! ChemVerse didesain responsif dengan tampilan yang nyaman dibaca pada layar smartphone, tablet, maupun laptop/komputer desktop.',
  },
  {
    id: 'faq-3',
    category: 'features',
    question: 'Bagaimana cara kerja Cek Pemahaman & Kuis 1.4?',
    answer:
      'Kuis 1.4 memuat 4 soal standar Fase F Kurikulum Merdeka (KNO₃, NaCl dengan volume STP Faraday, perbandingan massa CuSO₄ & lelehan AgI, serta tabel benar-salah pemurnian tembaga). Jawaban diperiksa seketika dengan pembahasan langkah demi langkah.',
  },
  {
    id: 'faq-4',
    category: 'features',
    question: 'Apakah nilai latihan otomatis tersimpan dan dilihat guru?',
    answer:
      'Ya. Setiap kali siswa menyelesaikan latihan, skor dan status belajar otomatis terekam dan langsung dapat dipantau oleh guru di Panel Guru serta dapat diexport ke format Excel (.CSV).',
  },
  {
    id: 'faq-5',
    category: 'xp',
    question: 'Bagaimana cara klaim XP dan apa gunanya?',
    answer:
      'XP (Experience Points) bertambah otomatis saat Anda membaca materi (+25 XP per bagian) dan menyelesaikan kuis (+100 XP). XP mencerminkan jam terbang dan keaktifan eksplorasi Anda di laboratorium virtual.',
  },
  {
    id: 'faq-6',
    category: 'xp',
    question: 'Bagaimana jika saya ingin mengulang latihan dari skor 0 (Reset Progress)?',
    answer:
      'Anda dapat menggunakan fitur Reset Progress di bawah ini untuk menghapus jawaban sementara kuis tanpa menghapus akun Anda, sehingga Anda dapat berlatih ulang dengan segar.',
  },
  {
    id: 'faq-7',
    category: 'curriculum',
    question: 'Apakah materi ini sudah sesuai dengan Kurikulum Merdeka Fase F?',
    answer:
      'Benar. ChemVerse dikembangkan khusus mengacu pada Capaian Pembelajaran (CP) Kimia Fase F SMA Kelas 12 pada materi Reaksi Redoks dan Sel Elektrokimia (Elektrolisis).',
  },
];

export const HelpCenterModal: React.FC<HelpCenterModalProps> = ({
  isOpen,
  onClose,
  onResetProgress,
  studentName = 'Siswa',
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'faq' | 'features' | 'tutorial' | 'reset' | 'contact'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleFaq = (id: string) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  const handleExecuteReset = () => {
    if (confirm('Apakah Anda yakin ingin mereset progres jawaban latihan kuis Anda?')) {
      if (onResetProgress) {
        onResetProgress();
      }
      setResetSuccessMessage('Progres latihan kuis Anda berhasil direset ke awal.');
      setTimeout(() => setResetSuccessMessage(null), 4000);
    }
  };

  const filteredFaqs = FAQ_LIST.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="modal-backdrop-generic help-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-window-teacher help-modal-window" onClick={(e) => e.stopPropagation()}>
        {/* Header Modal */}
        <div className="modal-header-teacher help-modal-header">
          <div className="help-header-title-box">
            <div className="help-icon-circle">
              <HelpCircle size={24} />
            </div>
            <div>
              <div className="help-badge-tag">Pusat Bantuan & Panduan</div>
              <h2 className="modal-title-text">Pusat Bantuan ChemVerse</h2>
              <p className="modal-subtitle-text">
                Butuh bantuan? Temukan jawaban cepat, panduan fitur, tutorial, dan kontak di sini:
              </p>
            </div>
          </div>
          <button type="button" className="btn-close-modal" onClick={onClose} aria-label="Tutup Pusat Bantuan">
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigasi Kategori Bantuan */}
        <div className="help-nav-tabs">
          <button
            type="button"
            className={`help-nav-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <Sparkles size={15} />
            <span>Semua Bantuan</span>
          </button>
          <button
            type="button"
            className={`help-nav-tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
            onClick={() => setActiveTab('faq')}
          >
            <HelpCircle size={15} />
            <span>FAQ Lengkap</span>
          </button>
          <button
            type="button"
            className={`help-nav-tab-btn ${activeTab === 'features' ? 'active' : ''}`}
            onClick={() => setActiveTab('features')}
          >
            <Zap size={15} />
            <span>Detail Fitur (XP & Lab)</span>
          </button>
          <button
            type="button"
            className={`help-nav-tab-btn ${activeTab === 'tutorial' ? 'active' : ''}`}
            onClick={() => setActiveTab('tutorial')}
          >
            <BookOpen size={15} />
            <span>Tutorial Belajar Efektif</span>
          </button>
          <button
            type="button"
            className={`help-nav-tab-btn ${activeTab === 'reset' ? 'active' : ''}`}
            onClick={() => setActiveTab('reset')}
          >
            <RotateCcw size={15} />
            <span>Reset & Klaim XP</span>
          </button>
          <button
            type="button"
            className={`help-nav-tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            <MessageCircle size={15} />
            <span>Kontak & Kurikulum</span>
          </button>
        </div>

        {/* Konten Bantuan */}
        <div className="help-modal-body">
          {/* 1. TUTORIAL SINGKAT: CARA BELAJAR EFEKTIF (Ditampilkan di tab 'all' atau 'tutorial') */}
          {(activeTab === 'all' || activeTab === 'tutorial') && (
            <section className="help-section-card tutorial-banner-card">
              <div className="help-section-header">
                <div className="help-card-icon tutorial-icon">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="help-section-title">Tutorial Singkat: “Cara Belajar Efektif di Platform Ini”</h3>
                  <p className="help-section-desc">
                    Ikuti 4 langkah terstruktur ini untuk menguasai konsep Sel Elektrolisis secara mendalam:
                  </p>
                </div>
              </div>

              <div className="learning-steps-grid">
                <div className="learning-step-item">
                  <div className="step-number-bubble">1</div>
                  <div className="step-content">
                    <h4>Pahami Teori Dasar (Modul 1.1)</h4>
                    <p>Pelajari definisi sel elektrolisis, perbedaan katode (-) dan anode (+), serta arah arus elektron.</p>
                  </div>
                </div>

                <div className="learning-step-item">
                  <div className="step-number-bubble">2</div>
                  <div className="step-content">
                    <h4>Kuasai Aturan Reaksi (Modul 1.2 & 1.3)</h4>
                    <p>Ingat aturan kation di katode (Golongan IA/IIA vs asam/logam lain) dan jenis elektroda di anode (inert vs aktif).</p>
                  </div>
                </div>

                <div className="learning-step-item">
                  <div className="step-number-bubble">3</div>
                  <div className="step-content">
                    <h4>Uji Pemahaman Mandiri (Modul 1.4)</h4>
                    <p>Kerjakan soal latihan kuis pilihan ganda dan analisis tabel benar-salah hukum Faraday secara teliti.</p>
                  </div>
                </div>

                <div className="learning-step-item">
                  <div className="step-number-bubble">4</div>
                  <div className="step-content">
                    <h4>Evaluasi & Tinjau Pembahasan</h4>
                    <p>Baca penjelasan langkah demi langkah pada setiap soal untuk memperbaiki miskonsepsi rumus stoikiometri.</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 2. PENJELASAN DETAIL SETIAP FITUR (Ditampilkan di tab 'all' atau 'features') */}
          {(activeTab === 'all' || activeTab === 'features') && (
            <section className="help-section-card">
              <div className="help-section-header">
                <div className="help-card-icon features-icon">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="help-section-title">Penjelasan Detail Setiap Fitur Platform</h3>
                  <p className="help-section-desc">Kenali fungsi setiap komponen pembelajaran di ChemVerse:</p>
                </div>
              </div>

              <div className="features-detail-grid">
                <div className="feature-detail-card">
                  <div className="feature-badge xp-badge">
                    <Zap size={14} />
                    <span>XP & Poin Kemajuan</span>
                  </div>
                  <h4>Sistem XP (Experience Points)</h4>
                  <p>
                    Setiap subtopik yang dibaca memberikan <strong>+25 XP</strong>, dan menyelesaikan seluruh soal kuis
                    memberikan <strong>+100 XP</strong>. Mengukur keaktifan dan konsistensi belajar siswa.
                  </p>
                </div>

                <div className="feature-detail-card">
                  <div className="feature-badge module-badge">
                    <FlaskConical size={14} />
                    <span>Modul 1: Elektrolisis</span>
                  </div>
                  <h4>Modul Belajar Terstruktur</h4>
                  <p>
                    Berisi 4 bagian belajar terintegrasi: Konsep Sel, Reaksi Katode & Anode, Perbandingan Lelehan vs
                    Larutan, serta Latihan Cek Pemahaman.
                  </p>
                </div>

                <div className="feature-detail-card">
                  <div className="feature-badge lab-badge">
                    <Sparkles size={14} />
                    <span>Lab Virtual Mandiri</span>
                  </div>
                  <h4>Lembar Kerja Laboratorium</h4>
                  <p>
                    Menyajikan visualisasi rumus KaTeX, persamaan setengah reaksi redoks, dan aturan elektrode inert (Pt, C)
                    maupun non-inert (Cu, Fe).
                  </p>
                </div>

                <div className="feature-detail-card">
                  <div className="feature-badge teacher-badge">
                    <GraduationCap size={14} />
                    <span>Panel Khusus Guru</span>
                  </div>
                  <h4>Pemantauan & Manajemen Soal</h4>
                  <p>
                    Guru dapat memantau perolehan nilai siswa secara langsung, mengunduh rekap nilai ke format Excel (.CSV),
                    serta menambah dan memperbarui bank soal.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* 3. PANDUAN RESET PROGRESS & CARA KLAIM XP (Ditampilkan di tab 'all' atau 'reset') */}
          {(activeTab === 'all' || activeTab === 'reset') && (
            <section className="help-section-card reset-guide-card">
              <div className="help-section-header">
                <div className="help-card-icon reset-icon">
                  <RotateCcw size={20} />
                </div>
                <div>
                  <h3 className="help-section-title">Panduan Reset Progress & Cara Klaim XP</h3>
                  <p className="help-section-desc">Atur ulang data latihan untuk mengulang belajar dari awal:</p>
                </div>
              </div>

              <div className="reset-info-box">
                <div className="reset-info-row">
                  <div className="info-badge-number">A</div>
                  <div>
                    <strong>Cara Klaim XP:</strong>
                    <p>
                      XP diklaim secara otomatis begitu Anda mengklik opsi jawaban pada kartu <strong>1.4 Cek Pemahaman</strong>.
                      Skor dan capaian Anda akan tersinkronisasi ke Dashboard Guru dan profil akun.
                    </p>
                  </div>
                </div>

                <div className="reset-info-row">
                  <div className="info-badge-number">B</div>
                  <div>
                    <strong>Kapan Perlu Melakukan Reset Progress?</strong>
                    <p>
                      Jika Anda ingin berlatih kembali menghadapi ulangan harian atau ingin mencoba menjawab kuis dari awal
                      dengan lembar jawaban bersih.
                    </p>
                  </div>
                </div>

                {resetSuccessMessage && (
                  <div className="reset-success-alert" role="alert">
                    <CheckCircle2 size={16} />
                    <span>{resetSuccessMessage}</span>
                  </div>
                )}

                <div className="reset-action-row">
                  <button type="button" className="btn btn-warning-action" onClick={handleExecuteReset}>
                    <RotateCcw size={16} />
                    <span>Reset Jawaban Latihan Kuis ({studentName})</span>
                  </button>
                  <span className="reset-note">
                    *Tindakan ini hanya menghapus centang jawaban kuis lokal di browser Anda agar Anda bisa berlatih ulang.
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* 4. FAQ LENGKAP SEPUTAR CARA MENGGUNAKAN PLATFORM (Ditampilkan di tab 'all' atau 'faq') */}
          {(activeTab === 'all' || activeTab === 'faq') && (
            <section className="help-section-card">
              <div className="help-section-header">
                <div className="help-card-icon faq-icon">
                  <HelpCircle size={20} />
                </div>
                <div>
                  <h3 className="help-section-title">FAQ Lengkap Seputar Platform ChemVerse</h3>
                  <p className="help-section-desc">Pertanyaan yang sering diajukan seputar platform dan materi:</p>
                </div>
              </div>

              {/* Pencarian FAQ */}
              <div className="faq-search-box">
                <Search size={16} className="faq-search-icon" />
                <input
                  type="text"
                  placeholder="Ketik kata kunci pertanyaan (misal: nilai, ponsel, kuis, XP)..."
                  className="faq-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="faq-accordion-list">
                {filteredFaqs.map((faq) => {
                  const isExpanded = expandedFaqId === faq.id;
                  return (
                    <div key={faq.id} className={`faq-accordion-item ${isExpanded ? 'open' : ''}`}>
                      <button type="button" className="faq-question-btn" onClick={() => toggleFaq(faq.id)}>
                        <span className="faq-q-text">{faq.question}</span>
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                      {isExpanded && (
                        <div className="faq-answer-pane">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 5. KONTAK BANTUAN LANGSUNG & LINK RESMI KURIKULUM (Ditampilkan di tab 'all' atau 'contact') */}
          {(activeTab === 'all' || activeTab === 'contact') && (
            <section className="help-section-card contact-section-card">
              <div className="help-section-header">
                <div className="help-card-icon contact-icon">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h3 className="help-section-title">Kontak Bantuan Langsung & Panduan Resmi</h3>
                  <p className="help-section-desc">Hubungi tim pembimbing kami atau akses sumber belajar resmi:</p>
                </div>
              </div>

              <div className="contact-options-grid">
                {/* Chat Admin */}
                <a
                  href="https://wa.me/6281234567890?text=Halo%20Admin%20ChemVerse,%20saya%20butuh%20bantuan%20terkait%20platform%20belajar%20sel%20elektrolisis."
                  target="_blank"
                  rel="noreferrer"
                  className="contact-card-btn whatsapp-card"
                >
                  <div className="contact-icon-box wa-icon-box">
                    <MessageCircle size={22} />
                  </div>
                  <div className="contact-card-text">
                    <strong>Chat Admin Kimia (WhatsApp)</strong>
                    <span>Konsultasi kendala teknis & pertanyaan materi</span>
                  </div>
                  <ExternalLink size={16} className="contact-ext-icon" />
                </a>

                {/* Email Support */}
                <a href="mailto:support@chemverse.edu?subject=Bantuan%20Platform%20ChemVerse" className="contact-card-btn email-card">
                  <div className="contact-icon-box mail-icon-box">
                    <Mail size={22} />
                  </div>
                  <div className="contact-card-text">
                    <strong>Kirim Email Bantuan</strong>
                    <span>support@chemverse.edu</span>
                  </div>
                  <ExternalLink size={16} className="contact-ext-icon" />
                </a>

                {/* Link Kurikulum Merdeka */}
                <a
                  href="https://kurikulum.kemdikbud.go.id"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-card-btn curriculum-card"
                >
                  <div className="contact-icon-box curr-icon-box">
                    <GraduationCap size={22} />
                  </div>
                  <div className="contact-card-text">
                    <strong>Panduan Kurikulum Merdeka (Kemdikbudristek)</strong>
                    <span>Capaian Pembelajaran (CP) Kimia Fase F</span>
                  </div>
                  <ExternalLink size={16} className="contact-ext-icon" />
                </a>

                {/* Panduan Teknis Lab */}
                <a
                  href="https://buku.kemdikbud.go.id"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-card-btn manual-card"
                >
                  <div className="contact-icon-box manual-icon-box">
                    <FileText size={22} />
                  </div>
                  <div className="contact-card-text">
                    <strong>Petunjuk Teknis & Buku Guru Kimia SMA</strong>
                    <span>Panduan praktikum & keselamatan laboratorium</span>
                  </div>
                  <ExternalLink size={16} className="contact-ext-icon" />
                </a>
              </div>
            </section>
          )}
        </div>

        {/* Footer Modal */}
        <div className="modal-footer-teacher help-modal-footer">
          <div className="help-footer-tagline">
            <Sparkles size={15} />
            <span>ChemVerse • Platform Pembelajaran Kimia Fase F Kurikulum Merdeka</span>
          </div>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Tutup Pusat Bantuan
          </button>
        </div>
      </div>
    </div>
  );
};
