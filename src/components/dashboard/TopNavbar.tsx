import React, { useState } from 'react';
import { Search, Bell, ChevronDown, User, LogOut } from 'lucide-react';
import type { StudentProfile } from '../auth/LoginScreen';

interface TopNavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenStudySheet: () => void;
  studentProfile: StudentProfile;
  onLogout?: () => void;
}

/**
 * TopNavbar bergaya pill rounded seperti gambar referensi.
 * Menampilkan pencarian konsep kimia, notifikasi materi, dan profil siswa yang sedang login.
 */
export const TopNavbar: React.FC<TopNavbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenStudySheet,
  studentProfile,
  onLogout,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Fungsi pembuat inisial 2 huruf dari nama siswa (contoh: "Elsa Rasengraffe" -> "ER")
  const getInitials = (fullName: string): string => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0 || !parts[0]) return 'S';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(studentProfile.name);

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

      {/* Sisi Kanan: Notifikasi & Profil Siswa Login */}
      <div className="topbar-right">
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

        {/* Profil Siswa yang Sedang Login */}
        <div style={{ position: 'relative' }}>
          <div
            className="user-profile-pill"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            title={`Profil: ${studentProfile.name} (${studentProfile.className})`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsDropdownOpen(!isDropdownOpen);
              }
            }}
          >
            <div className="user-avatar-circle">
              <span>{initials}</span>
            </div>
            <div>
              <div className="user-name">{studentProfile.name}</div>
              <span className="user-role-badge">{studentProfile.className}</span>
            </div>
            <ChevronDown size={14} className="user-dropdown-icon" />
          </div>

          {/* Dropdown Menu Profil Siswa */}
          {isDropdownOpen && (
            <div className="profile-dropdown-menu">
              <div className="dropdown-user-info">
                <div className="dropdown-avatar">{initials}</div>
                <div>
                  <strong>{studentProfile.name}</strong>
                  <span>{studentProfile.className}</span>
                </div>
              </div>
              <hr className="dropdown-divider" />
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
                  <span>Ganti Siswa / Keluar</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
