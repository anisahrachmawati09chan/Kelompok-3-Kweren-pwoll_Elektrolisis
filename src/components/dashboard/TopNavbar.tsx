import React, { useState } from 'react';
import { Search, Bell, ChevronDown, User, LogOut, BookOpen } from 'lucide-react';
import type { UserProfile } from '../../utils/studentRecords';

interface TopNavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenStudySheet: () => void;
  userProfile: UserProfile;
  onLogout?: () => void;
  onOpenTeacherDashboard?: () => void;
}

/**
 * TopNavbar bergaya pill rounded seperti gambar referensi.
 * Menampilkan pencarian konsep kimia, notifikasi materi, dan profil pengguna (Siswa atau Guru).
 */
export const TopNavbar: React.FC<TopNavbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenStudySheet,
  userProfile,
  onLogout,
  onOpenTeacherDashboard,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Inisial avatar
  const getInitials = (fullName: string): string => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0 || !parts[0]) return 'U';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(userProfile.name);
  const isTeacher = userProfile.role === 'teacher';
  const roleSubtitle = isTeacher ? userProfile.title : userProfile.className;

  return (
    <header className="dashboard-topbar">
      {/* Search Bar Pill */}
      <div className="search-box-pill">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Cari konsep sel elektrolisis, rumus, elektroda..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Sisi Kanan: Tombol Guru (Jika Guru), Notifikasi & Profil */}
      <div className="topbar-right">
        {/* Shortcut Dashboard Guru jika pengguna adalah Guru */}
        {isTeacher && onOpenTeacherDashboard && (
          <button
            type="button"
            className="btn btn-secondary btn-sm teacher-quick-pill"
            onClick={onOpenTeacherDashboard}
            title="Buka Dashboard Panel Guru"
          >
            <BookOpen size={15} />
            <span>Panel Guru</span>
          </button>
        )}

        {/* Tombol Notifikasi */}
        <button
          type="button"
          className="notification-pill-btn"
          title="Notifikasi Materi Baru: Modul 1 Aktif"
          aria-label="Notifikasi"
          onClick={onOpenStudySheet}
        >
          <Bell size={18} />
          <span className="notif-badge-dot" />
        </button>

        {/* Profil Pengguna yang Sedang Login */}
        <div style={{ position: 'relative' }}>
          <div
            className="user-profile-pill"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            title={`Profil: ${userProfile.name} (${roleSubtitle})`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsDropdownOpen(!isDropdownOpen);
              }
            }}
          >
            <div
              className={`user-avatar-circle ${isTeacher ? 'teacher-avatar-circle' : ''}`}
            >
              <span>{initials}</span>
            </div>
            <div>
              <div className="user-name">{userProfile.name}</div>
              <span className="user-role-badge">{roleSubtitle}</span>
            </div>
            <ChevronDown size={14} className="user-dropdown-icon" />
          </div>

          {/* Dropdown Menu Profil Pengguna */}
          {isDropdownOpen && (
            <div className="profile-dropdown-menu">
              <div className="dropdown-user-info">
                <div
                  className={`dropdown-avatar ${isTeacher ? 'teacher-avatar-circle' : ''}`}
                >
                  {initials}
                </div>
                <div>
                  <strong>{userProfile.name}</strong>
                  <span>{roleSubtitle}</span>
                </div>
              </div>
              <hr className="dropdown-divider" />

              {isTeacher && onOpenTeacherDashboard && (
                <button
                  type="button"
                  className="dropdown-menu-item"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onOpenTeacherDashboard();
                  }}
                >
                  <BookOpen size={16} />
                  <span>Buka Dashboard Guru</span>
                </button>
              )}

              <button
                type="button"
                className="dropdown-menu-item"
                onClick={() => {
                  setIsDropdownOpen(false);
                  onOpenStudySheet();
                }}
              >
                <User size={16} />
                <span>Buka Lembar Kerja Belajar</span>
              </button>

              {onLogout && (
                <button
                  type="button"
                  className="dropdown-menu-item text-danger"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onLogout();
                  }}
                >
                  <LogOut size={16} />
                  <span>Ganti Akun / Keluar</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
