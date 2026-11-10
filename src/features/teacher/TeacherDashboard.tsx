import React, { useState } from 'react';
import {
  Users,
  FileSpreadsheet,
  PlusCircle,
  Edit3,
  Trash2,
  RotateCcw,
  BookOpen,
  LogOut,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Eye,
  X,
  Save,
} from 'lucide-react';
import type { TeacherProfile, StudentRecord } from '../../utils/studentRecords';
import { exportStudentsToExcel } from '../../utils/studentRecords';
import type { QuizQuestion, MultipleChoiceQuestion, OptionItem } from '../../data/questionsData';

interface TeacherDashboardProps {
  teacherProfile: TeacherProfile;
  students: StudentRecord[];
  questions: QuizQuestion[];
  onSaveQuestions: (newQuestions: QuizQuestion[]) => void;
  onResetQuestions: () => void;
  onOpenStudentView: () => void;
  onLogout: () => void;
}

/**
 * TeacherDashboard: Panel Khusus Guru Kimia SMA
 * Fitur:
 * 1. Melihat data siswa yang login & skor latihan mereka secara real-time.
 * 2. Filter kelas dan pencarian nama siswa.
 * 3. Ekspor nilai siswa ke Excel (.CSV terformat rapi).
 * 4. Manajemen Soal: Guru dapat menambah soal baru, mengubah (edit) soal, dan menghapus soal.
 */
export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  teacherProfile,
  students,
  questions,
  onSaveQuestions,
  onResetQuestions,
  onOpenStudentView,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'questions'>('students');
  const [searchStudent, setSearchStudent] = useState<string>('');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('Semua');

  // State Modal Tambah / Edit Soal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<MultipleChoiceQuestion | null>(null);

  // Form State untuk Soal
  const [formTitle, setFormTitle] = useState<string>('');
  const [formTopic, setFormTopic] = useState<string>('');
  const [formText, setFormText] = useState<string>('');
  const [formOptions, setFormOptions] = useState<OptionItem[]>([
    { key: 'A', text: '', isCorrect: true },
    { key: 'B', text: '', isCorrect: false },
    { key: 'C', text: '', isCorrect: false },
    { key: 'D', text: '', isCorrect: false },
    { key: 'E', text: '', isCorrect: false },
  ]);
  const [formExplanation, setFormExplanation] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  // Filter Siswa
  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchStudent.toLowerCase());
    const matchesClass = selectedClassFilter === 'Semua' || s.className === selectedClassFilter;
    return matchesSearch && matchesClass;
  });

  // Statistik Siswa
  const totalStudents = students.length;
  const completedStudents = students.filter((s) => s.status === 'Selesai Latihan').length;
  const avgScore =
    totalStudents > 0
      ? (
          students.reduce((acc, curr) => acc + (curr.score / (curr.maxScore || 1)) * 100, 0) /
          totalStudents
        ).toFixed(1)
      : '0';

  // Handler Buka Modal Tambah Soal
  const handleOpenAddModal = () => {
    setEditingQuestion(null);
    setFormTitle(`Soal ${questions.length + 1}`);
    setFormTopic('Konsep Sel Elektrolisis');
    setFormText('');
    setFormOptions([
      { key: 'A', text: '', isCorrect: true },
      { key: 'B', text: '', isCorrect: false },
      { key: 'C', text: '', isCorrect: false },
      { key: 'D', text: '', isCorrect: false },
      { key: 'E', text: '', isCorrect: false },
    ]);
    setFormExplanation('');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Handler Buka Modal Edit Soal
  const handleOpenEditModal = (q: QuizQuestion) => {
    if (q.type !== 'multiple_choice') {
      alert('Soal tipe tabel benar-salah bawaan sistem dapat disesuaikan kembali melalui reset.');
      return;
    }
    setEditingQuestion(q);
    setFormTitle(q.title);
    setFormTopic(q.topic);
    setFormText(q.questionText);
    setFormOptions(q.options.map((opt) => ({ ...opt })));
    setFormExplanation(q.explanation);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Handler Simpan Soal (Tambah atau Edit)
  const handleSaveQuestionForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formText.trim()) {
      setFormError('Teks pertanyaan tidak boleh kosong.');
      return;
    }

    const hasEmptyOption = formOptions.some((opt) => !opt.text.trim());
    if (hasEmptyOption) {
      setFormError('Seluruh opsi A sampai E harus diisi.');
      return;
    }

    const hasCorrect = formOptions.some((opt) => opt.isCorrect);
    if (!hasCorrect) {
      setFormError('Pilih salah satu opsi sebagai kunci jawaban yang benar.');
      return;
    }

    if (editingQuestion) {
      // Edit soal yang sudah ada
      const updatedList = questions.map((q) => {
        if (q.id === editingQuestion.id && q.type === 'multiple_choice') {
          return {
            ...q,
            title: formTitle.trim() || q.title,
            topic: formTopic.trim() || q.topic,
            questionText: formText.trim(),
            options: formOptions,
            explanation: formExplanation.trim() || 'Pembahasan telah diperbarui oleh guru.',
          };
        }
        return q;
      });
      onSaveQuestions(updatedList);
    } else {
      // Tambah soal baru
      const newQuestion: MultipleChoiceQuestion = {
        id: `q-${Date.now()}`,
        type: 'multiple_choice',
        title: formTitle.trim() || `Soal ${questions.length + 1}`,
        topic: formTopic.trim() || 'Elektrokimia',
        questionText: formText.trim(),
        options: formOptions,
        explanation: formExplanation.trim() || 'Pembahasan soal baru dari guru.',
      };
      onSaveQuestions([...questions, newQuestion]);
    }

    setIsModalOpen(false);
  };

  // Handler Hapus Soal
  const handleDeleteQuestion = (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus ${title}?`)) {
      const remaining = questions.filter((q) => q.id !== id);
      onSaveQuestions(remaining);
    }
  };

  // Handler Export ke Excel
  const handleExportExcel = () => {
    exportStudentsToExcel(students);
  };

  return (
    <div className="teacher-panel-wrapper">
      {/* 1. Header Dashboard Guru */}
      <header className="teacher-header-bar">
        <div className="teacher-brand-info">
          <div className="teacher-avatar-box">
            <BookOpen size={24} />
          </div>
          <div>
            <div className="teacher-badge-tag">Panel Pengajar Kimia</div>
            <h1 className="teacher-main-title">{teacherProfile.name}</h1>
            <p className="teacher-sub-title">{teacherProfile.title}</p>
          </div>
        </div>

        <div className="teacher-header-actions">
          <button
            type="button"
            className="btn btn-secondary teacher-preview-btn"
            onClick={onOpenStudentView}
            title="Buka tampilan beranda siswa"
          >
            <Eye size={16} />
            <span>Lihat Tampilan Siswa / Lab</span>
          </button>

          <button
            type="button"
            className="btn btn-outline teacher-logout-btn"
            onClick={onLogout}
            title="Keluar dari akun guru"
          >
            <LogOut size={16} />
            <span>Keluar</span>
          </button>
        </div>
      </header>

      {/* 2. Navigasi Tab Guru */}
      <nav className="teacher-nav-tabs">
        <button
          type="button"
          className={`teacher-tab-btn ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          <Users size={18} />
          <span>Data Siswa & Nilai ({students.length})</span>
        </button>

        <button
          type="button"
          className={`teacher-tab-btn ${activeTab === 'questions' ? 'active' : ''}`}
          onClick={() => setActiveTab('questions')}
        >
          <Edit3 size={18} />
          <span>Kelola Soal Latihan ({questions.length})</span>
        </button>
      </nav>

      {/* 3. Konten Tab 1: Data & Nilai Siswa */}
      {activeTab === 'students' && (
        <section className="teacher-content-section">
          {/* Kartu Ringkasan Metrik */}
          <div className="teacher-stats-grid">
            <div className="teacher-stat-card">
              <span className="stat-card-label">Total Siswa Login</span>
              <div className="stat-card-val">{totalStudents} Siswa</div>
              <span className="stat-card-desc">Terdaftar di sistem lokal</span>
            </div>

            <div className="teacher-stat-card">
              <span className="stat-card-label">Siswa Selesai Latihan</span>
              <div className="stat-card-val text-success">{completedStudents} Siswa</div>
              <span className="stat-card-desc">Telah menuntaskan 4 soal</span>
            </div>

            <div className="teacher-stat-card">
              <span className="stat-card-label">Rata-Rata Nilai</span>
              <div className="stat-card-val text-primary">{avgScore}%</div>
              <span className="stat-card-desc">Skor rata-rata kelas</span>
            </div>
          </div>

          {/* Toolbar: Search, Filter Kelas, dan Tombol Export Excel */}
          <div className="teacher-table-toolbar">
            <div className="toolbar-left-group">
              {/* Kolom Cari Siswa */}
              <div className="student-search-box">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Cari nama siswa..."
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  className="student-search-input"
                />
              </div>

              {/* Filter Kelas */}
              <div className="class-filter-box">
                <Filter size={16} className="filter-icon" />
                <select
                  value={selectedClassFilter}
                  onChange={(e) => setSelectedClassFilter(e.target.value)}
                  className="class-filter-select"
                >
                  <option value="Semua">Semua Kelas</option>
                  <option value="Kelas 12 IPA 1">Kelas 12 IPA 1</option>
                  <option value="Kelas 12 IPA 2">Kelas 12 IPA 2</option>
                  <option value="Kelas 12 IPA 3">Kelas 12 IPA 3</option>
                  <option value="Fase F - Kimia 1">Fase F - Kimia 1</option>
                  <option value="Fase F - Kimia 2">Fase F - Kimia 2</option>
                </select>
              </div>
            </div>

            {/* Tombol Export ke Excel */}
            <button
              type="button"
              className="btn btn-primary teacher-export-btn"
              onClick={handleExportExcel}
              title="Unduh seluruh data nilai siswa ke format Microsoft Excel (.CSV)"
            >
              <FileSpreadsheet size={18} />
              <span>Export ke Excel (.CSV)</span>
            </button>
          </div>

          {/* Tabel Data Siswa */}
          <div className="teacher-table-card">
            <div className="table-responsive-wrapper">
              <table className="teacher-data-table">
                <thead>
                  <tr>
                    <th style={{ width: '45px' }}>No.</th>
                    <th>Nama Lengkap Siswa</th>
                    <th>Kelas</th>
                    <th>Waktu Login</th>
                    <th>Skor Diperoleh</th>
                    <th>Persentase</th>
                    <th>Status Pengerjaan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((s, idx) => {
                      const percent = Math.round((s.score / (s.maxScore || 1)) * 100);
                      const isComplete = s.status === 'Selesai Latihan';

                      return (
                        <tr key={s.id}>
                          <td style={{ fontWeight: 700, color: 'var(--text-muted)' }}>{idx + 1}</td>
                          <td>
                            <strong>{s.name}</strong>
                          </td>
                          <td>
                            <span className="table-class-pill">{s.className}</span>
                          </td>
                          <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <Clock size={13} />
                              <span>{s.loginTime}</span>
                            </div>
                          </td>
                          <td>
                            <span className="table-score-val">
                              {s.score} / {s.maxScore}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`table-percent-badge ${
                                percent >= 75 ? 'badge-high' : 'badge-mid'
                              }`}
                            >
                              {percent}%
                            </span>
                          </td>
                          <td>
                            <span
                              className={`status-pill ${
                                isComplete ? 'status-finished' : 'status-learning'
                              }`}
                            >
                              {isComplete && <CheckCircle2 size={12} />}
                              <span>{s.status}</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                        <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                          Tidak ada siswa yang sesuai dengan filter pencarian.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* 4. Konten Tab 2: Manajemen Soal (Kelola Soal Latihan) */}
      {activeTab === 'questions' && (
        <section className="teacher-content-section">
          <div className="questions-manager-header">
            <div>
              <h2 className="section-title">Bank Soal Sel Elektrolisis</h2>
              <p className="section-subtitle">
                Soal-soal ini langsung tampil pada kuis <strong>1.4 Cek Pemahaman</strong> siswa.
                Anda dapat menambah soal baru, mengubah opsi & pembahasan, atau menghapus soal.
              </p>
            </div>

            <div className="questions-action-btns">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleOpenAddModal}
              >
                <PlusCircle size={18} />
                <span>+ Tambah Soal Baru</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  if (confirm('Kembalikan bank soal ke 4 soal standar Kurikulum Merdeka?')) {
                    onResetQuestions();
                  }
                }}
                title="Reset kembali ke 4 soal bawaan PRD"
              >
                <RotateCcw size={16} />
                <span>Reset Soal Bawaan</span>
              </button>
            </div>
          </div>

          {/* Daftar Kartu Soal */}
          <div className="questions-list-stack">
            {questions.map((q, idx) => {
              const isMC = q.type === 'multiple_choice';

              return (
                <div key={q.id} className="teacher-question-card">
                  <div className="q-card-top-bar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span className="badge badge-primary">{q.title || `Soal ${idx + 1}`}</span>
                      <span className="q-topic-label">{q.topic}</span>
                      <span className="q-type-label">
                        {isMC ? 'Pilihan Ganda' : 'Tabel Benar–Salah'}
                      </span>
                    </div>

                    <div className="q-card-actions">
                      {isMC && (
                        <button
                          type="button"
                          className="btn-edit-question"
                          onClick={() => handleOpenEditModal(q)}
                          title="Ubah / Edit soal ini"
                        >
                          <Edit3 size={15} />
                          <span>Ubah Soal</span>
                        </button>
                      )}

                      <button
                        type="button"
                        className="btn-delete-question"
                        onClick={() => handleDeleteQuestion(q.id, q.title)}
                        title="Hapus soal ini"
                      >
                        <Trash2 size={15} />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>

                  <p className="q-card-text">{q.questionText}</p>

                  {/* Jika Pilihan Ganda: Tampilkan Opsi A-E */}
                  {isMC && (
                    <div className="q-options-preview">
                      <span className="preview-label">Pilihan Jawaban:</span>
                      <ul className="preview-options-list">
                        {(q as MultipleChoiceQuestion).options.map((opt) => (
                          <li
                            key={opt.key}
                            className={`preview-opt-item ${opt.isCorrect ? 'is-correct-opt' : ''}`}
                          >
                            <span className="opt-key-badge">{opt.key}</span>
                            <span className="opt-text">{opt.text}</span>
                            {opt.isCorrect && (
                              <span className="correct-tag">
                                <CheckCircle2 size={12} />
                                <span>Kunci Jawaban</span>
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Jika Tabel Benar Salah */}
                  {!isMC && (
                    <div className="q-options-preview">
                      <span className="preview-label">Pernyataan Benar-Salah:</span>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '0.35rem 0' }}>
                        Memuat 6 baris analisis konsep elektroda tembaga & Hukum Faraday.
                      </p>
                    </div>
                  )}

                  {/* Pembahasan */}
                  {isMC && (q as MultipleChoiceQuestion).explanation && (
                    <div className="q-explanation-box">
                      <strong>Pembahasan Guru:</strong>
                      <p>{(q as MultipleChoiceQuestion).explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. Modal Tambah / Edit Soal */}
      {isModalOpen && (
        <div className="modal-backdrop-generic" role="dialog" aria-modal="true">
          <div className="modal-window-teacher">
            <div className="modal-header-teacher">
              <div>
                <h3 className="modal-title-text">
                  {editingQuestion ? 'Ubah Soal Pilihan Ganda' : 'Tambah Soal Pilihan Ganda Baru'}
                </h3>
                <span className="modal-subtitle-text">
                  Kuis Latihan Elektrolisis • Fase F Kimia SMA Kelas 12
                </span>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveQuestionForm} className="modal-form-teacher">
              {formError && (
                <div className="form-error-alert" role="alert">
                  <span>{formError}</span>
                </div>
              )}

              <div className="form-row-duo">
                <div className="form-group">
                  <label className="form-label">Judul Soal:</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Contoh: Soal 5"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Topik Materi:</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formTopic}
                    onChange={(e) => setFormTopic(e.target.value)}
                    placeholder="Contoh: Hukum Faraday I / Larutan CuSO₄"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Teks Pertanyaan:</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  placeholder="Tuliskan pertanyaan soal secara lengkap..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Pilihan Jawaban (A - E) & Pilih Kunci Jawaban Benar:</label>
                <div className="options-editor-stack">
                  {formOptions.map((opt, idx) => (
                    <div key={opt.key} className="option-edit-row">
                      <span className="opt-row-key">{opt.key}</span>
                      <input
                        type="text"
                        className="form-input opt-text-input"
                        placeholder={`Teks pilihan ${opt.key}...`}
                        value={opt.text}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormOptions((prev) => {
                            const copy = [...prev];
                            copy[idx] = { ...copy[idx], text: val };
                            return copy;
                          });
                        }}
                      />
                      <label className="radio-correct-label" title="Pilih sebagai kunci jawaban yang benar">
                        <input
                          type="radio"
                          name="correct-option"
                          checked={opt.isCorrect}
                          onChange={() => {
                            setFormOptions((prev) =>
                              prev.map((item, i) => ({
                                ...item,
                                isCorrect: i === idx,
                              }))
                            );
                          }}
                        />
                        <span>Kunci Benar</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Pembahasan / Penjelasan Jawaban:</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={formExplanation}
                  onChange={(e) => setFormExplanation(e.target.value)}
                  placeholder="Tuliskan langkah penyelesaian atau penjelasan reaksi..."
                />
              </div>

              <div className="modal-footer-teacher">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  <span>{editingQuestion ? 'Simpan Perubahan Soal' : 'Tambahkan Soal ke Kuis'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
