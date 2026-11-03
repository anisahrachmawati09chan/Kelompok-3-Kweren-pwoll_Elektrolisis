import React from 'react';
import { FormulaRenderer } from './FormulaRenderer';

interface ReactionEquationProps {
  reactants: string;
  products: string;
  electronCount?: number;
  type?: 'reduction' | 'oxidation' | 'overall';
  conditionNote?: string;
  className?: string;
}

/**
 * Komponen untuk menampilkan persamaan reaksi elektrokimia.
 * Dirancang dengan ruang rumus yang lega (lab sheet style) dan ramah layar ponsel.
 */
export const ReactionEquation: React.FC<ReactionEquationProps> = ({
  reactants,
  products,
  type = 'reduction',
  conditionNote,
  className = '',
}) => {
  const typeBadge = {
    reduction: { label: 'Katode (Reduksi)', badgeClass: 'badge-katode' },
    oxidation: { label: 'Anode (Oksidasi)', badgeClass: 'badge-anode' },
    overall: { label: 'Reaksi Total', badgeClass: 'badge-primary' },
  }[type];

  return (
    <div className={`reaction-equation-container ${className}`}>
      <div className="reaction-header">
        <span className={`badge ${typeBadge.badgeClass}`}>{typeBadge.label}</span>
        {conditionNote && <span className="reaction-condition">{conditionNote}</span>}
      </div>

      <div className="reaction-formula-row">
        <span className="formula-part">
          <FormulaRenderer formula={reactants} />
        </span>
        <span className="formula-arrow" aria-hidden="true">→</span>
        <span className="formula-part">
          <FormulaRenderer formula={products} />
        </span>
      </div>
    </div>
  );
};

