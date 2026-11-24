import React, { useState } from 'react';
import { X, Maximize2, Minimize2, ExternalLink, RotateCcw, FlaskConical, Sparkles } from 'lucide-react';

interface VirtualLabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * VirtualLabModal: Media Pembelajaran Bantu Siswa Memahami Sel Elektrolisis
 * Menampilkan Lab Virtual Interaktif 5 Misi Penyelidikan:
 * 1. CuSO₄ + Karbon (Inert/Inert)
 * 2. NaCl pekat + Karbon (Anion halida)
 * 3. CuSO₄ + Tembaga (Elektroda aktif)
 * 4. NaCl leburan + Karbon (Leburan vs larutan)
 * 5. H₂SO₄ encer + Karbon (Elektrolisis air)
 */
export const VirtualLabModal: React.FC<VirtualLabModalProps> = ({ isOpen, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [reloadCounter, setReloadCounter] = useState<number>(0);

  if (!isOpen) return null;

  const handleReload = () => {
    setReloadCounter((prev) => prev + 1);
  };

  const handleOpenNewTab = () => {
    window.open('/lab-virtual.html', '_blank');
  };

  return (
    <div
      className={`virtual-lab-overlay ${isFullscreen ? 'fullscreen-mode' : ''}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`virtual-lab-container ${isFullscreen ? 'container-fullscreen' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar Lab Virtual */}
        <div className="virtual-lab-header">
          <div className="lab-header-left">
            <div className="lab-badge-icon">
              <FlaskConical size={22} />
            </div>
            <div>
              <div className="lab-tag-row">
                <span className="lab-tag-pill">
                  <Sparkles size={12} />
                  <span>Media Praktikum Virtual</span>
                </span>
                <span className="lab-status-online">🟢 Simulasi Siap</span>
              </div>
              <h2 className="lab-modal-title">Lab Virtual — Sel Elektrolisis Interaktif</h2>
              <p className="lab-modal-subtitle">
                Catat kondisi awal → jalankan tegangan DC → amati 3 fase → tulis bukti → tafsirkan reaksi redoks
              </p>
            </div>
          </div>

          <div className="lab-header-actions">
            <button
              type="button"
              className="btn btn-secondary btn-sm lab-action-btn"
              onClick={handleReload}
              title="Muat ulang simulasi dari awal"
            >
              <RotateCcw size={15} />
              <span>Muat Ulang</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm lab-action-btn"
              onClick={handleOpenNewTab}
              title="Buka lab di tab browser terpisah"
            >
              <ExternalLink size={15} />
              <span>Buka Tab Baru</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm lab-action-btn"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Keluar layar penuh' : 'Layar penuh'}
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              <span>{isFullscreen ? 'Kecilkan' : 'Layar Penuh'}</span>
            </button>

            <button
              type="button"
              className="btn-close-modal lab-close-btn"
              onClick={onClose}
              title="Tutup Lab Virtual"
              aria-label="Tutup Lab Virtual"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Frame Simulasi Lab Virtual */}
        <div className="virtual-lab-frame-wrapper">
          <iframe
            key={reloadCounter}
            src="/lab-virtual.html"
            title="Lab Virtual Sel Elektrolisis"
            className="virtual-lab-iframe"
            allow="fullscreen"
          />
        </div>
      </div>
    </div>
  );
};
