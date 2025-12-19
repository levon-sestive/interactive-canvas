import React from 'react';
import { Connection, MindMapNode } from '@/types/node';

interface ConnectionLinesProps {
  connections: Connection[];
  nodes: MindMapNode[];
}

const colorMap: Record<string, { start: string; end: string }> = {
  orange: { start: '#f97316', end: '#ea580c' },
  pink: { start: '#ec4899', end: '#db2777' },
  blue: { start: '#3b82f6', end: '#2563eb' },
  coral: { start: '#f87171', end: '#ef4444' },
};

export const ConnectionLines: React.FC<ConnectionLinesProps> = ({ connections, nodes }) => {
  const getNodePosition = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  const createCurvePath = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    
    // Create a curved control point
    const curveFactor = 0.3;
    const controlX = midX - dy * curveFactor;
    const controlY = midY + dx * curveFactor;

    return `M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`;
  };

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <defs>
        {Object.entries(colorMap).map(([key, { start, end }]) => (
          <linearGradient key={key} id={`gradient-${key}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={start} stopOpacity="0.8" />
            <stop offset="50%" stopColor={end} stopOpacity="1" />
            <stop offset="100%" stopColor={start} stopOpacity="0.8" />
          </linearGradient>
        ))}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {connections.map((connection, index) => {
        const from = getNodePosition(connection.from);
        const to = getNodePosition(connection.to);
        const path = createCurvePath(from, to);
        
        return (
          <g key={`${connection.from}-${connection.to}-${index}`}>
            {/* Glow effect */}
            <path
              d={path}
              fill="none"
              stroke={`url(#gradient-${connection.color})`}
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.3"
              filter="url(#glow)"
            />
            {/* Main line */}
            <path
              d={path}
              fill="none"
              stroke={`url(#gradient-${connection.color})`}
              strokeWidth="2"
              strokeLinecap="round"
              className="animate-pulse-glow"
            />
            {/* Connection dots */}
            <circle
              cx={from.x}
              cy={from.y}
              r="4"
              fill={colorMap[connection.color].start}
              className="animate-pulse-glow"
            />
            <circle
              cx={to.x}
              cy={to.y}
              r="4"
              fill={colorMap[connection.color].end}
              className="animate-pulse-glow"
            />
          </g>
        );
      })}
    </svg>
  );
};
