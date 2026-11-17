import React, { useState } from 'react';
import {
  X,
  Mail,
  Copy,
  Check,
  HelpCircle,
  Sparkles,
  ExternalLink,
  Users,
  Send,
  BookOpen,
  GraduationCap
} from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTeacherView?: () => void;
}

interface Founder {
  name: string;
  role: string;
  email: string;
  avatarInitials: string;
  avatarBg: string;
  division: string;
}

export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
  onOpenTeacherView,
}) => {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [feedbackSubject, setFeedbackSubject] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);

  if (!isOpen) return null;

  // Daftar pendiri & pengembang website Kelompok 3
  const founders: Founder[] = [
    {
      name: 'Affriza Sefia Azzahra',
      role: 'Lead Project & UI/UX Developer',
      email: 'affrizasefia@gmail.com',
      avatarInitials: 'AS',
      avatarBg: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      division: 'Arsitektur Aplikasi & Desain Interaktif',
    },
    {
      name: 'Anisah Rachmawati',
      role: 'Frontend & Interactive Chemistry Developer',
      email: 'anisahrachmawati09@gmail.com',
      avatarInitials: 'AR',
      avatarBg: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
      division: 'Pengembangan Fitur & Integrasi Modul Belajar',
    },
    {
      name: 'Fathimatuz Zahroh',
      role: 'Chemistry Content Curator & Evaluation Developer',
      email: 'fatuz.zahroh24@gmail.com',
      avatarInitials: 'FZ',
      avatarBg: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
      division: 'Validasi Kurikulum Elektrokimia & Bank Soal',
    },
  ];

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => {
      setCopiedEmail(null);
    }, 2500);
  };

  const handleCopyAllEmails = () => {
    const all = founders.map((f) => f.email).join(', ');
    navigator.clipboard.writeText(all);
    setCopiedEmail('ALL');
    setTimeout(() => {
      setCopiedEmail(null);
    }, 2500);
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;

    // Buka client email default dengan penerima semua pendiri
    const subject = encodeURIComponent(
      feedbackSubject || 'Pertanyaan & Masukan Pengguna ChemVerse (Elektrolisis)'
    );
    const body = encodeURIComponent(
      `${feedbackMessage}\n\n---\nDikirim melalui Pusat Bantuan ChemVerse (Kelompok 3 Keren Pwoll)`
    );
    const mailtoUrl = `mailto:affrizasefia@gmail.com,anisahrachmawati09@gmail.com,fatuz.zahroh24@gmail.com?subject=${subject}&body=${body}`;

    window.open(mailtoUrl, '_blank');
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setFeedbackSubject('');
      setFeedbackMessage('');
    }, 3000);
  };

  return (
    <div
      className="help-modal-backdrop"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="help-modal-window">
        {/* Header Modal Bantuan */}
        <div className="help-modal-header">
          <div className="help-header-left">
            <div className="help-icon-bubble">
              <HelpCircle size={24} />
            </div>
            <div>
              <div className="help-badge-pill">
                <Sparkles size={13} />
                <span>Pusat Bantuan & Kontak Pendiri</span>
              </div>
              <h2 className="help-modal-title">Bantuan Penggunaan & Kontak Tim</h2>
              <p className="help-modal-sub">
                Kelompok 3 (Kweren Pwoll) — Media Pembelajaran Sel Elektrolisis SMA Kelas 12
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn-modal-close"
            onClick={onClose}
            aria-label="Tutup Bantuan"
          >
            <X size={20} />
          </button>
        </div>

        {/* Konten Scrollable Modal */}
        <div className="help-modal-content">
          {/* Section 1: Daftar Email Pendiri Website */}
          <div className="help-section">
            <div className="help-section-title-row">
              <h3 className="help-section-title">
                <Users size={18} />
                <span>Email Pendiri & Pengembang Website</span>
              </h3>
              <button
                type="button"
                className="btn-copy-all"
                onClick={handleCopyAllEmails}
                title="Salin semua alamat email pendiri sekaligus"
              >
                {copiedEmail === 'ALL' ? (
                  <>
                    <Check size={14} />
                    <span>Semua Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Salin Semua Email</span>
                  </>
                )}
              </button>
            </div>

            <p className="help-section-desc">
              Ada kendala teknis, pertanyaan seputar materi kimia, atau ingin memberikan saran
              pengembangan? Hubungi langsung pendiri website melalui email di bawah ini:
            </p>

            <div className="founders-grid">
              {founders.map((founder) => {
                const isCopied = copiedEmail === founder.email;

                return (
                  <div key={founder.email} className="founder-card">
                    <div className="founder-card-top">
                      <div
                        className="founder-avatar"
                        style={{ background: founder.avatarBg }}
                      >
                        {founder.avatarInitials}
                      </div>
                      <div className="founder-info">
                        <h4 className="founder-name">{founder.name}</h4>
                        <div className="founder-role">{founder.role}</div>
                        <div className="founder-division">{founder.division}</div>
                      </div>
                    </div>

                    <div className="founder-email-box">
                      <div className="founder-email-address">
                        <Mail size={15} className="mail-icon" />
                        <span title={founder.email}>{founder.email}</span>
                      </div>
                      <div className="founder-email-actions">
                        <button
                          type="button"
                          className="btn-action-icon"
                          onClick={() => handleCopyEmail(founder.email)}
                          title="Salin Alamat Email"
                          aria-label="Salin Alamat Email"
                        >
                          {isCopied ? <Check size={15} color="#10b981" /> : <Copy size={15} />}
                        </button>
                        <a
                          href={`mailto:${founder.email}?subject=Tanya/Saran%20ChemVerse%20Elektrolisis`}
                          className="btn-action-mail"
                          target="_blank"
                          rel="noreferrer"
                          title="Buka Aplikasi Email"
                        >
                          <ExternalLink size={14} />
                          <span>Kirim</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Form Kirim Pesan Cepat ke Pendiri */}
          <div className="help-section help-section-form">
            <h3 className="help-section-title">
              <Mail size={18} />
              <span>Kirim Masukan Langsung ke Tim Pendiri</span>
            </h3>
            <p className="help-section-desc">
              Tulis pesan atau pertanyaan Anda di bawah ini untuk dikirimkan langsung ke email
              seluruh anggota tim pendiri.
            </p>

            <form onSubmit={handleSendFeedback} className="feedback-form">
              <div className="feedback-field">
                <label className="feedback-label">Subjek / Topik:</label>
                <input
                  type="text"
                  className="feedback-input"
                  placeholder="Contoh: Masukan tampilan simulator / Kendala perhitungan rumus"
                  value={feedbackSubject}
                  onChange={(e) => setFeedbackSubject(e.target.value)}
                />
              </div>

              <div className="feedback-field">
                <label className="feedback-label">Isi Pesan / Masukan:</label>
                <textarea
                  className="feedback-textarea"
                  rows={3}
                  placeholder="Tuliskan saran, pertanyaan, atau kendala yang Anda temui secara rinci..."
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  required
                />
              </div>

              <div className="feedback-footer">
                <span className="feedback-note">
                  *Pesan akan dibuka melalui email client Anda ke 3 pendiri sekaligus.
                </span>
                <button
                  type="submit"
                  className="btn-submit-feedback"
                  disabled={feedbackSent}
                >
                  {feedbackSent ? (
                    <>
                      <Check size={16} />
                      <span>Email Terbuka!</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Kirim Email ke Pendiri</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Section 3: Navigasi Bantuan Cepat */}
          <div className="help-section">
            <h3 className="help-section-title">
              <BookOpen size={18} />
              <span>Panduan Pintas Fitur Website</span>
            </h3>
            <div className="help-guides-grid">
              <div className="help-guide-item">
                <div className="guide-icon-pill">1</div>
                <div>
                  <strong>Modul Belajar (Modul 1 Aktif)</strong>
                  <p>
                    Klik kartu modul pada beranda untuk membuka lembar kerja interaktif:
                    Reaksi Redoks, Sel Volta vs Elektrolisis, Komponen Sel, dan Cek Pemahaman.
                  </p>
                </div>
              </div>

              <div className="help-guide-item">
                <div className="guide-icon-pill">2</div>
                <div>
                  <strong>Menu Tanya dengan Guru</strong>
                  <p>
                    Gunakan menu berikon topi sarjana untuk berkonsultasi langsung dengan
                    3 Guru Kimia SMA, bertanya seputar reaksi di elektroda, atau konsultasi WhatsApp.
                  </p>
                  {onOpenTeacherView && (
                    <button
                      type="button"
                      className="btn-jump-teacher"
                      onClick={() => {
                        onClose();
                        onOpenTeacherView();
                      }}
                    >
                      <GraduationCap size={15} />
                      <span>Buka Menu Tanya dengan Guru &gt;</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="help-guide-item">
                <div className="guide-icon-pill">3</div>
                <div>
                  <strong>Aturan Emas KRAO & PANIC</strong>
                  <p>
                    KRAO: Katode Reduksi, Anode Oksidasi.
                    PANIC: Positive Anode, Negative Is Cathode (berlaku khusus sel elektrolisis).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="help-modal-footer">
          <div className="footer-credits">
            © 2026 <strong>Kelompok 3 (Kweren Pwoll)</strong> — Proyek Web Pembelajaran Kimia Fase F
          </div>
          <button
            type="button"
            className="btn-help-close-primary"
            onClick={onClose}
          >
            Tutup Bantuan
          </button>
        </div>
      </div>
    </div>
  );
};
