import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  GraduationCap,
  Sparkles,
  Send,
  MessageSquare,
  Clock,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Search,
  MessageCircleQuestion,
  HelpCircle,
  ThumbsUp,
  CornerDownRight,
  User,
  ShieldCheck,
  Calendar,
  Layers
} from 'lucide-react';
import type { StudentProfile } from '../../components/auth/LoginScreen';
import {
  TEACHERS_LIST,
  TOPIC_OPTIONS,
  getSavedQuestions,
  saveQuestions,
  generateTeacherResponse,
  type Teacher,
  type TeacherQuestion,
  type QuestionReply
} from './teacherData';

interface AskTeacherViewProps {
  studentProfile: StudentProfile;
  onBackToHome: () => void;
  initialTopic?: string;
  onOpenHelp?: () => void;
}

export const AskTeacherView: React.FC<AskTeacherViewProps> = ({
  studentProfile,
  onBackToHome,
  initialTopic,
  onOpenHelp,
}) => {
  // State pertanyaan tersimpan
  const [questions, setQuestions] = useState<TeacherQuestion[]>(() => getSavedQuestions());

  // State form pengajuan pertanyaan
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('guru-ratna');
  const [selectedTopic, setSelectedTopic] = useState<string>(
    initialTopic || TOPIC_OPTIONS[0]
  );
  const [questionTitle, setQuestionTitle] = useState<string>('');
  const [questionBody, setQuestionBody] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // State filter & pencarian diskusi
  const [activeFilter, setActiveFilter] = useState<'all' | 'my' | 'answered'>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // State reply input per question thread
  const [activeReplyThreadId, setActiveReplyThreadId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  // Ref textarea untuk sisip simbol kimia
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Simpan ke localStorage setiap ada perubahan pertanyaan
  useEffect(() => {
    saveQuestions(questions);
  }, [questions]);

  // Update selected topic jika initialTopic berubah
  useEffect(() => {
    if (initialTopic) {
      setSelectedTopic(initialTopic);
    }
  }, [initialTopic]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

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

    const newQuestionId = 'q-' + Date.now();
    const newQuestion: TeacherQuestion = {
      id: newQuestionId,
      studentName: studentProfile.name,
      studentClass: studentProfile.className,
      teacherId: targetTeacher.id,
      teacherName: targetTeacher.name,
      topic: selectedTopic,
      title: questionTitle.trim(),
      content: questionBody.trim(),
      status: 'waiting',
      createdAt: 'Baru saja',
      likes: 1,
      replies: [],
    };

    // Tambahkan pertanyaan siswa ke daftar teratas
    setQuestions((prev) => [newQuestion, ...prev]);
    setQuestionTitle('');
    setQuestionBody('');
    setIsSubmitting(false);
    triggerToast(
      `Pertanyaan Anda terkirim ke ${targetTeacher.name}. Menunggu tanggapan bimbingan...`
    );

    // Simulasi respons interaktif guru dalam beberapa detik
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

      triggerToast(`${targetTeacher.name} telah membalas pertanyaan Anda!`);
    }, 3800);
  };

  /**
   * Handler menambah balasan / reply siswa pada sebuah thread
   */
  const handleSendReply = (questionId: string) => {
    if (!replyText.trim()) return;

    const newReply: QuestionReply = {
      id: 'rep-' + Date.now(),
      senderType: 'student',
      senderName: studentProfile.name,
      senderRole: studentProfile.className,
      content: replyText.trim(),
      timestamp: 'Baru saja',
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

    setReplyText('');
    setActiveReplyThreadId(null);
    triggerToast('Tanggapan Anda berhasil ditambahkan ke diskusi.');
  };

  /**
   * Menambah suka / apresiasi diskusi
   */
  const handleLikeQuestion = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, likes: q.likes + 1 } : q))
    );
  };

  /**
   * Membuka obrolan WhatsApp dengan guru tujuan menggunakan pesan sopan
   */
  const handleOpenWhatsApp = (teacher: Teacher) => {
    const message = encodeURIComponent(
      `Halo ${teacher.name}, perkenalkan saya ${studentProfile.name} dari ${studentProfile.className}. Izin bertanya seputar materi Kimia Sel Elektrolisis: `
    );
    window.open(`https://wa.me/${teacher.whatsappNumber}?text=${message}`, '_blank');
  };

  // Filter daftar pertanyaan
  const filteredQuestions = questions.filter((q) => {
    // Filter tab
    if (activeFilter === 'my' && q.studentName !== studentProfile.name) {
      return false;
    }
    if (activeFilter === 'answered' && q.status !== 'answered') {
      return false;
    }

    // Filter teks pencarian
    if (searchFilter.trim()) {
      const query = searchFilter.toLowerCase();
      const matchTitle = q.title.toLowerCase().includes(query);
      const matchContent = q.content.toLowerCase().includes(query);
      const matchTopic = q.topic.toLowerCase().includes(query);
      const matchTeacher = q.teacherName.toLowerCase().includes(query);
      return matchTitle || matchContent || matchTopic || matchTeacher;
    }

    return true;
  });

  const selectedTeacher =
    TEACHERS_LIST.find((t) => t.id === selectedTeacherId) || TEACHERS_LIST[0];

  return (
    <div className="teacher-view-wrapper">
      {/* 1. Breadcrumb Bar & Tombol Kembali */}
      <div className="teacher-breadcrumb-bar">
        <button
          type="button"
          className="btn-back-home"
          onClick={onBackToHome}
          title="Kembali ke Beranda Dashboard"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Beranda Utama</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="teacher-online-summary-pill">
            <span className="online-pulse-dot" />
            <span>3 Guru Kimia Siap Bimbingan</span>
          </div>

          {onOpenHelp && (
            <button
              type="button"
              className="btn-back-home"
              onClick={onOpenHelp}
              title="Buka Pusat Bantuan & Email Pendiri"
            >
              <HelpCircle size={16} />
              <span>Bantuan & Pendiri</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Hero Banner: Tanya dengan Guru */}
      <div className="teacher-hero-banner">
        <div className="teacher-hero-content">
          <div className="teacher-hero-badge">
            <GraduationCap size={15} />
            <span>Bimbingan Kimia Online Fase F</span>
          </div>
          <h1 className="teacher-hero-title">Tanya dengan Guru Kimia</h1>
          <p className="teacher-hero-desc">
            Mengalami kesulitan memahami reaksi di katode dan anode, aturan KRAO/PANIC, atau
            perhitungan Hukum Faraday? Tanyakan langsung kepada guru pengampu kimia Anda di sini
            untuk mendapatkan penjelasan konsep dan pembahasan soal langkah demi langkah.
          </p>

          <div className="teacher-hero-stats">
            <div className="hero-stat-item">
              <CheckCircle2 size={16} color="#34d399" />
              <span>
                Siswa Login: <strong>{studentProfile.name}</strong> ({studentProfile.className})
              </span>
            </div>
            <div className="hero-stat-item">
              <Clock size={16} color="#38bdf8" />
              <span>
                Respons Rata-rata: <strong>Cepat (&lt; 15 menit)</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="teacher-hero-icon-graphic" aria-hidden="true">
          <GraduationCap size={56} />
        </div>
      </div>

      {/* 3. Direktori Guru Kimia Pengampu */}
      <section className="teacher-directory-section">
        <div className="section-title-row">
          <h2 className="section-heading-sm">
            <GraduationCap size={20} color="#4f46e5" />
            <span>Daftar Guru Kimia Pengampu</span>
          </h2>
          <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            Klik &quot;Pilih Guru&quot; untuk mengarahkan pertanyaan Anda
          </span>
        </div>

        <div className="teachers-cards-grid">
          {TEACHERS_LIST.map((teacher) => {
            const isSelected = selectedTeacherId === teacher.id;

            return (
              <div
                key={teacher.id}
                className={`teacher-card ${isSelected ? 'selected-target' : ''}`}
              >
                <div>
                  <div className="teacher-card-header">
                    <div
                      className="teacher-avatar-circle"
                      style={{ background: teacher.avatarBg }}
                    >
                      {teacher.avatarInitials}
                    </div>
                    <div className="teacher-header-info">
                      <h3 className="teacher-name-title">{teacher.name}</h3>
                      <div className="teacher-role-text">{teacher.title}</div>
                      <span
                        className={`teacher-status-badge ${
                          teacher.status === 'online'
                            ? 'status-online'
                            : teacher.status === 'busy'
                            ? 'status-busy'
                            : 'status-offline'
                        }`}
                      >
                        <span
                          className="online-pulse-dot"
                          style={{
                            backgroundColor:
                              teacher.status === 'online'
                                ? '#10b981'
                                : teacher.status === 'busy'
                                ? '#f59e0b'
                                : '#94a3b8',
                          }}
                        />
                        <span>{teacher.statusLabel}</span>
                      </span>
                    </div>
                  </div>

                  <div className="teacher-body-details">
                    <div className="teacher-detail-item">
                      <Sparkles size={14} />
                      <span>
                        <strong>Keahlian:</strong> {teacher.specialty}
                      </span>
                    </div>
                    <div className="teacher-detail-item">
                      <Calendar size={14} />
                      <span>
                        <strong>Jam Bimbingan:</strong> {teacher.officeHours}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="teacher-card-actions">
                  <button
                    type="button"
                    className="btn-select-teacher"
                    onClick={() => {
                      setSelectedTeacherId(teacher.id);
                      triggerToast(`Guru tujuan diatur ke: ${teacher.name}`);
                    }}
                  >
                    {isSelected ? '✓ Guru Terpilih' : 'Pilih Guru Ini'}
                  </button>

                  <button
                    type="button"
                    className="btn-whatsapp-teacher"
                    onClick={() => handleOpenWhatsApp(teacher)}
                    title={`Hubungi ${teacher.name} via WhatsApp`}
                  >
                    <ExternalLink size={14} />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Formulir Ajukan Pertanyaan Baru (Interaktif) */}
      <section className="ask-question-card">
        <div className="form-header-row">
          <div>
            <h2 className="section-heading-sm">
              <MessageSquare size={20} color="#6366f1" />
              <span>Ajukan Pertanyaan Baru ke Guru</span>
            </h2>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.2rem' }}>
              Pertanyaan Anda akan langsung ditujukan ke{' '}
              <strong>{selectedTeacher.name}</strong>
            </p>
          </div>

          <div className="student-tag-pill">
            <User size={14} />
            <span>
              Penanya: {studentProfile.name} ({studentProfile.className})
            </span>
          </div>
        </div>

        <form onSubmit={handleQuestionSubmit}>
          <div className="ask-form-grid">
            <div className="form-field-group">
              <label className="form-label" htmlFor="teacher-select">
                <GraduationCap size={15} />
                <span>Pilih Guru Tujuan:</span>
              </label>
              <select
                id="teacher-select"
                className="form-select"
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
              >
                {TEACHERS_LIST.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} — {t.role}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field-group">
              <label className="form-label" htmlFor="topic-select">
                <BookOpen size={15} />
                <span>Kategori Topik Materi:</span>
              </label>
              <select
                id="topic-select"
                className="form-select"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
              >
                {TOPIC_OPTIONS.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-field-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" htmlFor="question-title-input">
              <span>Judul / Pokok Pertanyaan:</span>
            </label>
            <input
              id="question-title-input"
              type="text"
              className="form-input"
              placeholder="Contoh: Mengapa pada elektrolisis larutan CuSO4 terbentuk tembaga di katode?"
              value={questionTitle}
              onChange={(e) => setQuestionTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-field-group">
            <label className="form-label" htmlFor="question-body-input">
              <span>Uraian Pertanyaan Secara Rinci:</span>
            </label>
            <textarea
              id="question-body-input"
              ref={textareaRef}
              className="form-textarea"
              placeholder="Jelaskan bagian konsep atau soal yang membingungkan. Anda dapat menyisipkan simbol kimia di bawah ini agar rapi..."
              value={questionBody}
              onChange={(e) => setQuestionBody(e.target.value)}
              required
            />
          </div>

          {/* Quick Chemical Symbol Toolbar */}
          <div className="chemical-symbol-toolbar">
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
                Pertanyaan akan otomatis dikirimkan ke guru yang dipilih dan masuk riwayat kelas.
              </span>
            </div>

            <button
              type="submit"
              className="btn-submit-question"
              disabled={isSubmitting}
            >
              <Send size={16} />
              <span>{isSubmitting ? 'Mengirimkan...' : 'Kirim Pertanyaan ke Guru'}</span>
            </button>
          </div>
        </form>
      </section>

      {/* 5. Forum & Riwayat Tanya Jawab */}
      <section className="discussion-section">
        <div className="discussion-controls-bar">
          <div className="discussion-filter-tabs">
            <button
              type="button"
              className={`filter-tab-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              Semua Diskusi ({questions.length})
            </button>
            <button
              type="button"
              className={`filter-tab-btn ${activeFilter === 'my' ? 'active' : ''}`}
              onClick={() => setActiveFilter('my')}
            >
              Pertanyaan Saya (
              {questions.filter((q) => q.studentName === studentProfile.name).length})
            </button>
            <button
              type="button"
              className={`filter-tab-btn ${activeFilter === 'answered' ? 'active' : ''}`}
              onClick={() => setActiveFilter('answered')}
            >
              Sudah Terjawab Guru (
              {questions.filter((q) => q.status === 'answered').length})
            </button>
          </div>

          <div className="discussion-search-box">
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder="Cari topik, soal, rumus, atau guru..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>
        </div>

        {/* List of Question Threads */}
        <div className="questions-threads-list">
          {filteredQuestions.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                background: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                color: '#64748b',
              }}
            >
              <MessageCircleQuestion size={40} style={{ opacity: 0.5, marginBottom: '0.75rem' }} />
              <p style={{ fontWeight: 600 }}>Tidak ada pertanyaan yang sesuai dengan filter.</p>
              <p style={{ fontSize: '0.8125rem' }}>
                Silakan gunakan formulir di atas untuk mengajukan pertanyaan pertama Anda!
              </p>
            </div>
          ) : (
            filteredQuestions.map((q) => (
              <article key={q.id} className="question-thread-card">
                <div className="thread-header">
                  <div className="thread-meta-left">
                    <span className="topic-badge-chip">{q.topic}</span>
                    <span className="thread-author-info">
                      Oleh <strong>{q.studentName}</strong> • {q.studentClass} • {q.createdAt}
                    </span>
                  </div>

                  <span
                    className={`thread-status-badge ${
                      q.status === 'answered' ? 'answered' : 'waiting'
                    }`}
                  >
                    {q.status === 'answered' ? (
                      <>
                        <CheckCircle2 size={13} />
                        <span>Dijawab oleh {q.teacherName.split(',')[0]}</span>
                      </>
                    ) : (
                      <>
                        <Clock size={13} />
                        <span>Menunggu Tanggapan Guru</span>
                      </>
                    )}
                  </span>
                </div>

                <h3 className="thread-title">{q.title}</h3>
                <div className="thread-content-text">{q.content}</div>

                {/* Balasan Guru & Diskusi Lanjutan */}
                {q.replies && q.replies.length > 0 && (
                  <div className="thread-replies-container">
                    {q.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className={`reply-card ${
                          reply.senderType === 'teacher'
                            ? 'teacher-reply'
                            : 'student-reply'
                        }`}
                      >
                        <div className="reply-header">
                          <div className="reply-author">
                            <div
                              className="reply-avatar-sm"
                              style={{
                                background:
                                  reply.senderType === 'teacher'
                                    ? '#4f46e5'
                                    : '#ea580c',
                              }}
                            >
                              {reply.senderType === 'teacher' ? 'G' : 'S'}
                            </div>
                            <span className="reply-author-name">{reply.senderName}</span>
                            <span className="reply-role-tag">{reply.senderRole}</span>
                          </div>
                          <span className="reply-timestamp">{reply.timestamp}</span>
                        </div>

                        <div className="reply-body-text">{reply.content}</div>

                        {reply.formulaNotes && (
                          <div className="formula-highlight-box">
                            <Sparkles size={14} />
                            <span>
                              <strong>Rumus Kunci Guru:</strong> {reply.formulaNotes}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form for Students */}
                <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                  {activeReplyThreadId === q.id ? (
                    <div className="reply-input-box">
                      <input
                        type="text"
                        className="reply-input-field"
                        placeholder="Tulis balasan atau tanya balik ke guru..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendReply(q.id);
                        }}
                      />
                      <button
                        type="button"
                        className="btn-send-reply"
                        onClick={() => handleSendReply(q.id)}
                      >
                        <Send size={13} />
                        <span>Kirim Balasan</span>
                      </button>
                      <button
                        type="button"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#64748b',
                          cursor: 'pointer',
                          fontSize: '0.8125rem',
                        }}
                        onClick={() => {
                          setActiveReplyThreadId(null);
                          setReplyText('');
                        }}
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <button
                        type="button"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#4f46e5',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                        onClick={() => setActiveReplyThreadId(q.id)}
                      >
                        <CornerDownRight size={14} />
                        <span>Tanggapi / Balas Pertanyaan Ini</span>
                      </button>

                      <button
                        type="button"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#64748b',
                          fontSize: '0.8125rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                        onClick={() => handleLikeQuestion(q.id)}
                        title="Bermanfaat untuk saya"
                      >
                        <ThumbsUp size={13} />
                        <span>Bermanfaat ({q.likes})</span>
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {/* 6. Pedoman Konsultasi & Jadwal Laboratorium */}
      <section className="teacher-tips-grid">
        <div className="info-box-card">
          <div className="info-box-header">
            <ShieldCheck size={18} color="#4f46e5" />
            <span>Etika & Panduan Bertanya</span>
          </div>
          <ul className="info-box-list">
            <li>
              <CheckCircle2 size={15} />
              <span>Gunakan bahasa yang sopan dan cantumkan bagian soal yang belum dipahami.</span>
            </li>
            <li>
              <CheckCircle2 size={15} />
              <span>Gunakan tombol toolbar simbol kimia agar penulisan ion dan reaksi jelas.</span>
            </li>
            <li>
              <CheckCircle2 size={15} />
              <span>Cek diskusi yang sudah terjawab sebelum bertanya, barangkali soal serupa telah dibahas.</span>
            </li>
          </ul>
        </div>

        <div className="info-box-card">
          <div className="info-box-header">
            <Calendar size={18} color="#0284c7" />
            <span>Jadwal Lab & Bimbingan Tatap Muka</span>
          </div>
          <ul className="info-box-list">
            <li>
              <Layers size={15} />
              <span>Laboratorium Kimia SMA Gedung Sains Lt. 2</span>
            </li>
            <li>
              <Clock size={15} />
              <span>Praktek Eksperimen: Selasa & Kamis (13.30 - 15.30 WIB)</span>
            </li>
            <li>
              <Users size={15} />
              <span>Konsultasi Khusus Kelompok 3 (Kweren Pwoll) bersama Dra. Hj. Ratna Juwita</span>
            </li>
          </ul>
        </div>
      </section>

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

