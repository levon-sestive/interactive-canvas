import React from 'react';

interface CategoryGroupProps {
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const CategoryGroup: React.FC<CategoryGroupProps> = ({ label, x, y, width, height }) => {
  return (
    <div
      className="absolute pointer-events-none animate-fade-in"
      style={{
        left: x,
        top: y,
        width,
        height,
        animationDelay: '0.2s',
      }}
    >
      {/* Dashed border container */}
      <div 
        className="w-full h-full rounded-3xl border-2 border-dashed"
        style={{
          borderColor: 'hsla(var(--border), 0.4)',
          background: 'hsla(var(--card), 0.1)',
        }}
      />
      
      {/* Category label */}
      <div 
        className="absolute -top-3 left-6 px-3 py-1 text-sm font-display font-medium text-muted-foreground"
        style={{
          background: 'hsl(var(--background))',
        }}
      >
        {label}
      </div>
    </div>
  );
};
