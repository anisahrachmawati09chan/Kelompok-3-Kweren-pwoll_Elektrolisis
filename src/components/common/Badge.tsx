import React from 'react';

interface BadgeProps {
  variant?: 'primary' | 'anode' | 'katode' | 'success' | 'warning' | 'locked';
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  children,
  icon,
  className = '',
}) => {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
