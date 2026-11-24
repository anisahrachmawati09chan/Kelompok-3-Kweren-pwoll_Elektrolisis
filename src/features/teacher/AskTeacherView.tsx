import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  GraduationCap,
  Sparkles,
  Send,
  MessageSquare,
  Search,
  MessageCircleQuestion,
  ThumbsUp,
  User,
  ShieldCheck,
  Plus,
  Pin,
  ChevronRight,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import type { StudentProfile, UserProfile } from '../../utils/studentRecords';
import {
  TEACHERS_LIST,
  TOPIC_OPTIONS,
  getSavedQuestions,
  saveQuestions,
  generateTeacherResponse,
  type TeacherQuestion,
} from './teacherData';

interface AskTeacherViewProps {
  studentProfile: StudentProfile | UserProfile;
  onBackToHome: () => void;
  initialTopic?: string;
  onOpenHelp?: () => void;
  onOpenTeacherDashboard?: () => void;
}

/**
 * AskTeacherView - Halaman Tanya Guru & Ruang Diskusi Terbimbing
 * Mengikuti tampilan visual Image 2 secara presisi:
 * 1. Banner Biru Tua: "Tanya Guru & Ruang Diskusi Terbimbing" + 3 Tombol Aksi
 * 2. Bar Filter & Pencarian: Cari topik, Filter Kategori Modul, & Urutan Terbaru
 * 3. Daftar Kartu Diskusi: Menampilkan pertanyaan Elsa Rasengraffe (Disematkan), Revalina Putri, dll.
 * 4. Interaktivitas Akordion: "Buka Diskusi >" untuk melihat jawaban detail guru dan membalas pertanyaan.
 * 5. Formulir "+ Buat Pertanyaan Baru" dengan toolbar rumus kimia.
 */
export const AskTeacherView: React.FC<AskTeacherViewProps> = ({
  studentProfile,
  onBackToHome,
  initialTopic,
  onOpenTeacherDashboard,
}) => {
  // State pertanyaan tersimpan
  const [questions, setQuestions] = useState<TeacherQuestion[]>(() => getSavedQuestions());

  // State tampilan form pertanyaan baru (toggle)
  const [isFormOpen, setIsFormOpen] = useState<boolean>(!!initialTopic);

  // State form pengajuan pertanyaan
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('guru-ratna');
  const [selectedTopic, setSelectedTopic] = useState<string>(
    initialTopic || TOPIC_OPTIONS[3] // Default ke 'Aturan Katode & Anode (KRAO & PANIC)'
  );
  const [questionTitle, setQuestionTitle] = useState<string>('');
  const [questionBody, setQuestionBody] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // State pencarian & filter
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortFilter, setSortFilter] = useState<'newest' | 'popular'>('newest');

  // State thread yang sedang dibuka detailnya (accordion)
  const [expandedThreadIds, setExpandedThreadIds] = useState<Record<string, boolean>>({
    'q-101': false,
  });

  // State balasan per thread
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});

  // Ref textarea untuk sisip simbol kimia
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Simpan ke localStorage setiap ada perubahan pertanyaan
  useEffect(() => {
    saveQuestions(questions);
  }, [questions]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const authorClass =
    'className' in studentProfile && studentProfile.className
      ? studentProfile.className
      : studentProfile.role === 'teacher'
      ? 'Guru Kimia SMA'
      : 'Kelas 12 IPA 1';

  /**
   * Menyisipkan simbol atau rumus kimia tepat pada posisi kursor textarea
   */
  const handleInsertSymbol = (symbol: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setQuestionBody((prev) => prev + symbol);
      return;
    }

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const textBefore = questionBody.substring(0, startPos);
    const textAfter = questionBody.substring(endPos, questionBody.length);

    setQuestionBody(textBefore + symbol + textAfter);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(startPos + symbol.length, startPos + symbol.length);
    }, 10);
  };

  /**
   * Toggle buka/tutup akordion diskusi
   */
  const toggleThread = (threadId: string) => {
    setExpandedThreadIds((prev) => ({
      ...prev,
      [threadId]: !prev[threadId],
    }));
  };

  /**
   * Tambah Like / Bermanfaat
   */
  const handleLike = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, likes: q.likes + 1 } : q))
    );
    triggerToast('Terima kasih atas tanggapan Anda! Pertanyaan ditandai Bermanfaat.');
  };

  /**
   * Handler submit pertanyaan baru dari siswa
   */
  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionTitle.trim() || !questionBody.trim()) {
      triggerToast('Mohon lengkapi judul dan rincian pertanyaan Anda.');
      return;
    }

    setIsSubmitting(true);
    const targetTeacher =
      TEACHERS_LIST.find((t) => t.id === selectedTeacherId) || TEACHERS_LIST[0];

    const now = new Date();
    const dateFormatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(
      2,
      '0'
    )}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newQuestionId = 'q-' + Date.now();
    const newQuestion: TeacherQuestion = {
      id: newQuestionId,
      studentName: studentProfile.name,
      studentClass: authorClass,
      teacherId: targetTeacher.id,
      teacherName: targetTeacher.name,
      topic: selectedTopic,
      title: questionTitle.trim(),
      content: questionBody.trim(),
      status: 'waiting',
      createdAt: dateFormatted,
      likes: 1,
      replies: [],
    };

    setQuestions((prev) => [newQuestion, ...prev]);
    setQuestionTitle('');
    setQuestionBody('');
    setIsSubmitting(false);
    setIsFormOpen(false);
    triggerToast(
      `Pertanyaan Anda berhasil dikirim ke ${targetTeacher.name}! Menunggu tanggapan bimbingan...`
    );

    // Simulasi respons cerdas guru kimia setelah beberapa detik
    setTimeout(() => {
      const teacherReply = generateTeacherResponse(
        targetTeacher,
        studentProfile.name,
        newQuestion.topic,
        newQuestion.content
      );

      setQuestions((currentQuestions) =>
        currentQuestions.map((q) => {
          if (q.id === newQuestionId) {
            return {
              ...q,
              status: 'answered',
              replies: [...q.replies, teacherReply],
            };
          }
          return q;
        })
      );

      triggerToast(`${targetTeacher.name} telah memberikan penjelasan dan rumus pembahasan!`);
    }, 3800);
  };

  /**
   * Handler kirim balasan / reply pada thread diskusi
   */
  const handleSendReply = (questionId: string) => {
    const text = replyTexts[questionId];
    if (!text || !text.trim()) return;

    const now = new Date();
    const timeFormatted = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')} WIB`;

    const newReply = {
      id: 'rep-' + Date.now(),
      senderType: (studentProfile.role === 'teacher' ? 'teacher' : 'student') as
        | 'teacher'
        | 'student',
      senderName: studentProfile.name,
      senderRole: authorClass,
      timestamp: `Hari ini, ${timeFormatted}`,
      content: text.trim(),
    };

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            replies: [...q.replies, newReply],
          };
        }
        return q;
      })
    );

    setReplyTexts((prev) => ({ ...prev, [questionId]: '' }));
    triggerToast('Tanggapan Anda berhasil ditambahkan ke ruang diskusi!');
  };

  // Filter & Urutkan Pertanyaan
  const filteredQuestions = questions
    .filter((q) => {
      // Filter Kategori
      if (categoryFilter !== 'all' && q.topic !== categoryFilter) {
        return false;
      }

      // Filter Pencarian
      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase();
        const matchTitle = q.title.toLowerCase().includes(query);
        const matchContent = q.content.toLowerCase().includes(query);
        const matchTopic = q.topic.toLowerCase().includes(query);
        const matchAuthor = q.studentName.toLowerCase().includes(query);
        return matchTitle || matchContent || matchTopic || matchAuthor;
      }

      return true;
    })
    .sort((a, b) => {
      // Selalu utamakan pertanyaan yang disematkan (pinned)
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      if (sortFilter === 'popular') {
        return b.likes - a.likes;
      }
      return 0; // Default order
    });

  const selectedTeacher =
    TEACHERS_LIST.find((t) => t.id === selectedTeacherId) || TEACHERS_LIST[0];

  return (
    <div className="tg-view-container">
      {/* 1. HERO BANNER: TANYA GURU & RUANG DISKUSI TERBIMBING (PERSIS GAMBAR 2) */}
      <section className="tg-hero-banner">
        <div className="tg-tag-pill">
          <MessageSquare size={13} />
          <span>FITUR DISKUSI DUA ARAH • TANYA GURU</span>
        </div>

        <h1 className="tg-banner-title">Tanya Guru & Ruang Diskusi Terbimbing</h1>

        <p className="tg-banner-subtitle">
          Sampaikan pertanyaan seputar konsep sel elektrolisis, reaksi katode/anode, atau
          perhitungan Hukum Faraday. Dapatkan penjelasan langsung serta diskusi timbal balik bersama
          guru pengampu.
        </p>

        {/* Baris 3 Tombol Aksi Hero Banner */}
        <div className="tg-banner-buttons">
          <button
            type="button"
            className="btn-tg-primary"
            onClick={() => setIsFormOpen(!isFormOpen)}
            title="Buka formulir pengajuan pertanyaan baru"
          >
            <Plus size={16} />
            <span>{isFormOpen ? 'Tutup Formulir Pertanyaan' : 'Buat Pertanyaan Baru'}</span>
          </button>

          <button
            type="button"
            className="btn-tg-secondary"
            onClick={() => {
              if (onOpenTeacherDashboard) {
                onOpenTeacherDashboard();
              } else {
                triggerToast('Panel Moderasi Guru: Semua pertanyaan terpantau aktif oleh pengampu kimia.');
              }
            }}
            title="Buka Panel Moderasi Guru"
          >
            <ShieldCheck size={16} />
            <span>Panel Moderasi Guru (0)</span>
          </button>

          <button
            type="button"
            className="btn-tg-secondary"
            onClick={onBackToHome}
            title="Kembali ke Beranda Utama Dashboard"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Beranda</span>
          </button>
        </div>
      </section>

      {/* 2. FORMULIR AJUKAN PERTANYAAN BARU (INTERAKTIF & COLLAPSIBLE) */}
      {isFormOpen && (
        <section className="ask-question-card" style={{ animation: 'fadeIn 0.2s ease-out' }}>
          <div className="form-header-row">
            <div>
              <h2 className="section-heading-sm">
                <MessageSquare size={20} color="#4338ca" />
                <span>Ajukan Pertanyaan Baru ke Guru Kimia</span>
              </h2>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.2rem' }}>
                Pertanyaan Anda akan langsung ditujukan ke{' '}
                <strong>{selectedTeacher.name}</strong>
              </p>
            </div>

            <div className="student-tag-pill">
              <User size={14} />
              <span>
                Penanya: {studentProfile.name} ({authorClass})
              </span>
            </div>
          </div>

          <form onSubmit={handleQuestionSubmit}>
            <div className="ask-form-grid">
              <div className="form-field-group">
                <label className="form-label" htmlFor="tg-teacher-select">
                  <GraduationCap size={15} />
                  <span>Pilih Guru Pengampu Tujuan:</span>
                </label>
                <select
                  id="tg-teacher-select"
                  className="form-select"
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                >
                  {TEACHERS_LIST.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field-group">
                <label className="form-label" htmlFor="tg-topic-select">
                  <Sparkles size={15} />
                  <span>Kategori Topik Materi:</span>
                </label>
                <select
                  id="tg-topic-select"
                  className="form-select"
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                >
                  {TOPIC_OPTIONS.map((top) => (
                    <option key={top} value={top}>
                      {top}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-field-group">
              <label className="form-label" htmlFor="tg-title-input">
                Judul Pertanyaan:
              </label>
              <input
                id="tg-title-input"
                type="text"
                className="form-input-text"
                placeholder="Contoh: Bagaimana cara membedakan reaksi katode pada lelehan vs larutan NaCl?"
                value={questionTitle}
                onChange={(e) => setQuestionTitle(e.target.value)}
              />
            </div>

            <div className="form-field-group">
              <label className="form-label" htmlFor="tg-body-textarea">
                Rincian Pertanyaan & Bagian yang Kurang Dipahami:
              </label>
              <textarea
                id="tg-body-textarea"
                ref={textareaRef}
                className="form-textarea"
                rows={4}
                placeholder="Jelaskan pertanyaan Anda secara spesifik. Gunakan tombol simbol kimia di bawah bila perlu..."
                value={questionBody}
                onChange={(e) => setQuestionBody(e.target.value)}
              />
            </div>

            {/* Toolbar Simbol Kimia Cepat */}
            <div className="chemical-symbols-toolbar">
              <span className="toolbar-label">
                <Sparkles size={13} />
                <span>Sisipkan Simbol Kimia:</span>
              </span>
              {[
                'Cu²⁺',
                'SO₄²⁻',
                'Cl⁻',
                'Na⁺',
                'H₂O',
                'O₂',
                'H₂',
                'e⁻',
                '→',
                'Katode (-)',
                'Anode (+)',
                'E° sel',
                'w = (e · i · t) / 96500',
              ].map((sym) => (
                <button
                  key={sym}
                  type="button"
                  className="symbol-chip-btn"
                  onClick={() => handleInsertSymbol(` ${sym} `)}
                  title={`Sisipkan ${sym}`}
                >
                  {sym}
                </button>
              ))}
            </div>

            <div className="form-submit-row">
              <div className="form-help-hint">
                <ShieldCheck size={16} color="#10b981" />
                <span>
                  Pertanyaan Anda akan diproses guru pengampu dan muncul di forum ruang diskusi.
                </span>
              </div>

              <button type="submit" className="btn-submit-question" disabled={isSubmitting}>
                <Send size={16} />
                <span>{isSubmitting ? 'Mengirimkan...' : 'Kirim Pertanyaan ke Guru'}</span>
              </button>
            </div>
          </form>
        </section>
      )}

      {/* 3. BARIS KONTROL & FILTER DISKUSI (PERSIS GAMBAR 2) */}
      <div className="tg-controls-bar">
        <div className="tg-search-wrapper">
          <Search size={18} className="tg-search-icon" />
          <input
            type="text"
            className="tg-search-input"
            placeholder="Cari topik, pertanyaan, atau nama..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>

        <div className="tg-dropdowns-group">
          {/* Dropdown Kategori Modul */}
          <select
            className="tg-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            title="Filter berdasarkan topik modul"
          >
            <option value="all">Semua Kategori Modul</option>
            {TOPIC_OPTIONS.map((top) => (
              <option key={top} value={top}>
                {top}
              </option>
            ))}
          </select>

          {/* Dropdown Pengurutan */}
          <select
            className="tg-select"
            value={sortFilter}
            onChange={(e) => setSortFilter(e.target.value as 'newest' | 'popular')}
            title="Urutkan pertanyaan"
          >
            <option value="newest">Terbaru</option>
            <option value="popular">Paling Populer</option>
          </select>
        </div>
      </div>

      {/* 4. DAFTAR KARTU DISKUSI TERBIMBING (PERSIS GAMBAR 2) */}
      <div className="tg-threads-list">
        {filteredQuestions.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '3.5rem 1.5rem',
              backgroundColor: '#ffffff',
              borderRadius: '18px',
              border: '1px solid #e2e8f0',
              color: '#64748b',
            }}
          >
            <MessageCircleQuestion size={44} style={{ opacity: 0.5, marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1e293b' }}>
              Tidak ada diskusi yang cocok
            </h3>
            <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Gunakan kotak pencarian atau klik &quot;Buat Pertanyaan Baru&quot; untuk memulai diskusi!
            </p>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isExpanded = !!expandedThreadIds[q.id];

            return (
              <article key={q.id} className="tg-thread-card">
                {/* Header Kartu: Badges Kiri & Info Penulis Kanan */}
                <div className="tg-card-header">
                  <div className="tg-card-badges">
                    <span className="badge-kategori-chip">{q.topic}</span>
                    {q.pinned && (
                      <span className="badge-pinned-chip">
                        <Pin size={12} />
                        <span>Disematkan Guru</span>
                      </span>
                    )}
                  </div>

                  <span className="tg-author-meta">
                    Oleh <strong>{q.studentName}</strong> ({q.studentClass}) • {q.createdAt}
                  </span>
                </div>

                {/* Judul & Isi Pertanyaan */}
                <h2 className="tg-card-title">{q.title}</h2>
                <p className="tg-card-snippet">{q.content}</p>

                {/* Footer Kartu: Tanggapan, Bermanfaat, & Tombol Buka Diskusi */}
                <div className="tg-card-footer">
                  <div className="tg-stats-left">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MessageSquare size={14} color="#64748b" />
                      <span>{q.replies.length} Tanggapan</span>
                    </span>

                    <button
                      type="button"
                      className="tg-stat-item"
                      onClick={() => handleLike(q.id)}
                      title="Tandai bermanfaat"
                    >
                      <ThumbsUp size={14} />
                      <span>{q.likes} Bermanfaat</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    className="btn-buka-diskusi"
                    onClick={() => toggleThread(q.id)}
                    title={isExpanded ? 'Tutup rincian diskusi' : 'Buka rincian diskusi lengkap'}
                  >
                    <span>{isExpanded ? 'Tutup Diskusi' : 'Buka Diskusi'}</span>
                    {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                  </button>
                </div>

                {/* AREA DISKUSI TERBIMBING LENGKAP (AKORDION EXPANDED) */}
                {isExpanded && (
                  <div
                    style={{
                      marginTop: '1.25rem',
                      paddingTop: '1.25rem',
                      borderTop: '1px solid #f1f5f9',
                      animation: 'fadeIn 0.2s ease-out',
                    }}
                  >
                    {/* Daftar Balasan Guru & Siswa */}
                    {q.replies && q.replies.length > 0 ? (
                      <div className="thread-replies-container">
                        {q.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className={`reply-card ${
                              reply.senderType === 'teacher' ? 'teacher-reply' : 'student-reply'
                            }`}
                          >
                            <div className="reply-header">
                              <div className="reply-author">
                                <div
                                  className="reply-avatar-sm"
                                  style={{
                                    background:
                                      reply.senderType === 'teacher'
                                        ? 'linear-gradient(135deg, #4338ca 0%, #3730a3 100%)'
                                        : 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                                  }}
                                >
                                  {reply.senderType === 'teacher' ? 'G' : 'S'}
                                </div>
                                <span className="reply-author-name">{reply.senderName}</span>
                                <span className="reply-role-tag">{reply.senderRole}</span>
                              </div>
                              <span className="reply-timestamp">{reply.timestamp}</span>
                            </div>

                            <div
                              className="reply-body-text"
                              style={{ whiteSpace: 'pre-line', marginTop: '0.45rem' }}
                            >
                              {reply.content}
                            </div>

                            {reply.formulaNotes && (
                              <div className="formula-highlight-box" style={{ marginTop: '0.75rem' }}>
                                <Sparkles size={14} />
                                <span>
                                  <strong>Rumus Kunci Guru:</strong> {reply.formulaNotes}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          padding: '1.25rem',
                          backgroundColor: '#f8fafc',
                          borderRadius: '12px',
                          color: '#64748b',
                          fontSize: '0.875rem',
                          textAlign: 'center',
                          marginBottom: '1rem',
                        }}
                      >
                        <CheckCircle2 size={18} style={{ color: '#10b981', verticalAlign: '-3px' }} />
                        <span> Menunggu balasan dan tinjauan konsep dari guru pengampu...</span>
                      </div>
                    )}

                    {/* Input Balasan Cepat di Dalam Thread */}
                    <div className="reply-input-box" style={{ marginTop: '1rem' }}>
                      <input
                        type="text"
                        className="reply-input-field"
                        placeholder="Tulis balasan atau tanggapan Anda ke guru..."
                        value={replyTexts[q.id] || ''}
                        onChange={(e) =>
                          setReplyTexts((prev) => ({ ...prev, [q.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendReply(q.id);
                        }}
                      />
                      <button
                        type="button"
                        className="btn-send-reply"
                        onClick={() => handleSendReply(q.id)}
                        title="Kirim tanggapan"
                      >
                        <Send size={15} />
                        <span>Kirim</span>
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {/* Toast Notifikasi */}
      {toastMessage && (
        <div className="dash-toast" role="alert">
          <Sparkles size={16} className="dash-toast-icon" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
