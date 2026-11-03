import React from 'react';

interface FormulaRendererProps {
  formula: string;
  className?: string;
}

/**
 * Komponen untuk menampilkan rumus kimia dengan format subskrip, superskrip, muatan ion, dan panah reaksi.
 * Contoh masukan: "Cu2+", "SO4^2-", "2H2O", "Cl-", "Na+", "e-", "Cu2+ + 2e- -> Cu(s)"
 */
export const FormulaRenderer: React.FC<FormulaRendererProps> = ({ formula, className = '' }) => {
  const formatted = formula
    .replace(/->/g, ' → ')
    .replace(/\^/g, '')
    .replace(/2\+/g, '²⁺')
    .replace(/3\+/g, '³⁺')
    .replace(/\+/g, '⁺')
    .replace(/2-/g, '²⁻')
    .replace(/3-/g, '³⁻')
    .replace(/e-/g, 'e⁻')
    .replace(/-/g, '⁻')
    .replace(/2(?![⁺⁻\d])/g, '₂')
    .replace(/3(?![⁺⁻\d])/g, '₃')
    .replace(/4(?![⁺⁻\d])/g, '₄');

  return (
    <span className={`chem-formula ${className}`}>
      {formatted}
    </span>
  );
};
