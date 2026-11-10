import React from 'react';
import { Home, LayoutGrid, MessageSquare, Clock, HelpCircle, LogOut, FlaskConical } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onLogout?: () => void;
}

/**
 * Sidebar bergaya modern seperti gambar referensi:
 * - Warna dasar Deep Indigo
 * - Notch kurva aktif (curved seamless notch)
 * - Tombol gambar rumah (Home) untuk beranda utama
 * - Ikon navigasi bersih dan ramah bagi yang baru belajar React
 */
export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onLogout,
}) => {
  const navItems = [
    { id: 'home', label: 'Beranda Utama', icon: Home },
    { id: 'modules', label: 'Modul Belajar', icon: LayoutGrid },
    { id: 'discuss', label: 'Soal Latihan', icon: MessageSquare },
    { id: 'history', label: 'Riwayat & Progres', icon: Clock },
    { id: 'help', label: 'Panduan PRD', icon: HelpCircle },
  ];

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-top">
        {/* Logo ChemVerse */}
        <div className="sidebar-logo">
          <div className="logo-circle" title="ChemVerse Learning">
            <FlaskConical size={20} />
          </div>
          <span className="logo-label">CHEM</span>
        </div>

        {/* Menu Navigasi Vertikal */}
        <ul className="sidebar-nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <li
                key={item.id}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <button
                  type="button"
                  className="sidebar-nav-btn"
                  onClick={() => onTabChange(item.id)}
                  title={item.label}
                  aria-label={item.label}
                >
                  <Icon size={20} />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Tombol Bawah (Keluar / Ganti Siswa) */}
      <div className="sidebar-bottom">
        <button
          type="button"
          className="sidebar-logout-btn"
          onClick={onLogout}
          title="Keluar / Ganti Siswa"
          aria-label="Keluar / Ganti Siswa"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};
