import React from 'react';

interface ProgressBarProps {
  progressPercentage: number;
  height?: number;
  color?: string;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progressPercentage,
  height = 8,
  color,
  showLabel = false,
}) => {
  const clamped = Math.min(100, Math.max(0, progressPercentage));

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Progres Belajar</span>
          <span style={{ fontWeight: 700, color: 'var(--primary-600)' }}>{clamped}%</span>
        </div>
      )}
      <div className="progress-container" style={{ height: `${height}px` }}>
        <div
          className="progress-fill"
          style={{
            width: `${clamped}%`,
            ...(color ? { background: color } : {}),
          }}
        />
      </div>
    </div>
  );
};
