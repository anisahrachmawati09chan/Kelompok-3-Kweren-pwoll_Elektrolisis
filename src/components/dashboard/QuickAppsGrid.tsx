import React from 'react';
import { Lock, Sparkles, BookOpen, Calculator, Layers, Award, GraduationCap, HelpCircle } from 'lucide-react';

interface QuickAppsGridProps {
  onOpenStudySheet: (subtopicId?: string) => void;
  onLockedClick: (title: string) => void;
  onOpenTeacher?: () => void;
  onOpenHelp?: () => void;
}

/**
 * QuickAppsGrid: Mengikuti section "Other applications" pada gambar referensi.
 * Menampilkan grid 2 kolom dari modul, pedoman laboratorium, Tanya Guru, dan Bantuan.
 */
export const QuickAppsGrid: React.FC<QuickAppsGridProps> = ({
  onOpenStudySheet,
  onLockedClick,
  onOpenTeacher,
  onOpenHelp,
}) => {
  const items = [
    {
      id: 'teacher-ask',
      label: 'Tanya dengan Guru',
      icon: GraduationCap,
      badgeText: '3 Guru Online',
      badgeClass: 'badge-pro',
      locked: false,
      isTeacherAction: true,
    },
    {
      id: 'help-founders',
      label: 'Bantuan & Email Pendiri',
      icon: HelpCircle,
      badgeText: 'Kelompok 3',
      badgeClass: 'badge-gold',
      locked: false,
      isHelpAction: true,
    },
    {
      id: 'krao',
      label: 'Aturan Emas KRAO',
      icon: BookOpen,
      badgeText: 'Pedoman',
      badgeClass: 'badge-gold',
      locked: false,
      targetSubtopic: '1.1',
    },
    {
      id: 'panic',
      label: 'Mnemonik PANIC',
      icon: BookOpen,
      badgeText: 'Fase F',
      badgeClass: 'badge-pro',
      locked: false,
      targetSubtopic: '1.2',
    },
    {
      id: 'ch2',
      label: 'Bab 2: Rangkaian & Ion',
      icon: Layers,
      badgeText: 'Belum Tersedia',
      badgeClass: 'badge-locked',
      locked: true,
    },
    {
      id: 'ch3',
      label: 'Bab 3: Lab Virtual Reaksi',
      icon: Sparkles,
      badgeText: 'Belum Tersedia',
      badgeClass: 'badge-locked',
      locked: true,
    },
    {
      id: 'ch4',
      label: 'Bab 4: Kalkulator Faraday',
      icon: Calculator,
      badgeText: 'Belum Tersedia',
      badgeClass: 'badge-locked',
      locked: true,
    },
    {
      id: 'ch5',
      label: 'Bab 5: Evaluasi & Ujian',
      icon: Award,
      badgeText: 'Belum Tersedia',
      badgeClass: 'badge-locked',
      locked: true,
    },
  ];

  const handleItemClick = (item: typeof items[0]) => {
    if (item.locked) {
      onLockedClick(item.label);
    } else if (item.isTeacherAction && onOpenTeacher) {
      onOpenTeacher();
    } else if (item.isHelpAction && onOpenHelp) {
      onOpenHelp();
    } else if (item.targetSubtopic) {
      onOpenStudySheet(item.targetSubtopic);
    }
  };

  return (
    <div>
      <div className="section-header-row">
        <h3 className="section-main-heading">Menu Bimbingan & Rencana Modul</h3>
      </div>

      <div className="capsule-apps-grid">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className={`capsule-app-card ${item.locked ? 'locked-app' : 'interactive-app'}`}
              onClick={() => handleItemClick(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleItemClick(item);
                }
              }}
              title={item.locked ? `${item.label} (Belum Tersedia)` : `Buka ${item.label}`}
            >
              <div className="app-card-left">
                {item.locked ? (
                  <Lock size={16} className="app-icon" />
                ) : (
                  <Icon size={16} className="app-icon" />
                )}
                <span className="app-label">{item.label}</span>
              </div>

              <span className={`app-badge-pill ${item.badgeClass}`}>
                {item.badgeText}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

