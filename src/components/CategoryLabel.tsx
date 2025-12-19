import React from 'react';

interface CategoryLabelProps {
  label: string;
  x: number;
  y: number;
}

export const CategoryLabel: React.FC<CategoryLabelProps> = ({ label, x, y }) => {
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 category-label text-muted-foreground animate-fade-in"
      style={{
        left: x,
        top: y,
        animationDelay: '0.3s',
      }}
    >
      {label}
    </div>
  );
};
