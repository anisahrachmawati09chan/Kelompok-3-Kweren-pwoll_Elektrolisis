import React from 'react';
import { Lock, BookOpen, Calculator, Layers, Award, FlaskConical } from 'lucide-react';

interface QuickAppsGridProps {
  onOpenStudySheet: (subtopicId?: string) => void;
  onLockedClick: (title: string) => void;
  onOpenVirtualLab?: () => void;
}

/**
 * QuickAppsGrid: Mengikuti section "Other applications" pada gambar referensi.
 * Menampilkan grid 2 kolom dari modul lanjutan, lab virtual interaktif aktif,
 * dan pedoman laboratorium.
 */
export const QuickAppsGrid: React.FC<QuickAppsGridProps> = ({
  onOpenStudySheet,
  onLockedClick,
  onOpenVirtualLab,
}) => {
  const items = [
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
      icon: FlaskConical,
      badgeText: '🟢 Siap Eksplorasi',
      badgeClass: 'badge-lab-active',
      locked: false,
      isVirtualLab: true,
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
  ];

  return (
    <div>
      <div className="section-header-row">
        <h3 className="section-main-heading">Rencana Modul & Referensi Lab</h3>
      </div>

      <div className="capsule-apps-grid">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className={`capsule-app-card ${item.locked ? 'locked-app' : 'interactive-app'}`}
              onClick={() => {
                if (item.isVirtualLab && onOpenVirtualLab) {
                  onOpenVirtualLab();
                } else if (item.locked) {
                  onLockedClick(item.label);
                } else if (item.targetSubtopic) {
                  onOpenStudySheet(item.targetSubtopic);
                }
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  if (item.isVirtualLab && onOpenVirtualLab) {
                    onOpenVirtualLab();
                  } else if (item.locked) {
                    onLockedClick(item.label);
                  } else if (item.targetSubtopic) {
                    onOpenStudySheet(item.targetSubtopic);
                  }
                }
              }}
              title={
                item.isVirtualLab
                  ? 'Buka Lab Virtual Interaktif Sel Elektrolisis'
                  : item.locked
                  ? `${item.label} (Belum Tersedia)`
                  : `Buka ${item.label}`
              }
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
