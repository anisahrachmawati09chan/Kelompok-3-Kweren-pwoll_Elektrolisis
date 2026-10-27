import React from 'react';

interface FormulaRendererProps {
  formula: string;
  className?: string;
}

/**
 * Renders chemical formulas with parsed subscripts, superscripts, and charges.
 * Example inputs: "Cu2+", "SO4^2-", "2H2O", "Cl-", "Na+", "e-"
 */
export const FormulaRenderer: React.FC<FormulaRendererProps> = ({ formula, className = '' }) => {
  // Simple parser: converts numbers following elements to subscript, and signs/charges to superscript
  const formatted = formula
    .replace(/2\+/g, '²⁺')
    .replace(/3\+/g, '³⁺')
    .replace(/\+/g, '⁺')
    .replace(/2-/g, '²⁻')
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
