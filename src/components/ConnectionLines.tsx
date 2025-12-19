import React from 'react';
import { Connection, MindMapNode } from '@/types/node';

interface ConnectionLinesProps {
  connections: Connection[];
  nodes: MindMapNode[];
}

const colorMap: Record<string, { start: string; end: string }> = {
  orange: { start: '#f97316', end: '#ea580c' },
  pink: { start: '#ec4899', end: '#db2777' },
  blue: { start: '#60a5fa', end: '#3b82f6' },
  coral: { start: '#f87171', end: '#ef4444' },
};

export const ConnectionLines: React.FC<ConnectionLinesProps> = ({ connections, nodes }) => {
  const getNodePosition = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  const createCurvePath = (from: { x: number; y: number }, to: { x: number; y: number }, curveIntensity = 0.2) => {
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    
    // Create a curved control point perpendicular to the line
    const controlX = midX - dy * curveIntensity;
    const controlY = midY + dx * curveIntensity;

    return `M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`;
  };

  // Get midpoint of a quadratic bezier curve
  const getMidpoint = (from: { x: number; y: number }, to: { x: number; y: number }, curveIntensity = 0.2) => {
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const controlX = midX - dy * curveIntensity;
    const controlY = midY + dx * curveIntensity;
    
    // Quadratic bezier at t=0.5
    const t = 0.5;
    const x = (1-t)*(1-t)*from.x + 2*(1-t)*t*controlX + t*t*to.x;
    const y = (1-t)*(1-t)*from.y + 2*(1-t)*t*controlY + t*t*to.y;
    
    return { x, y };
  };

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <defs>
        {Object.entries(colorMap).map(([key, { start, end }]) => (
          <React.Fragment key={key}>
            <linearGradient id={`gradient-${key}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={start} stopOpacity="0.7" />
              <stop offset="50%" stopColor={end} stopOpacity="0.9" />
              <stop offset="100%" stopColor={start} stopOpacity="0.7" />
            </linearGradient>
            <radialGradient id={`dot-gradient-${key}`}>
              <stop offset="0%" stopColor={start} stopOpacity="1" />
              <stop offset="100%" stopColor={end} stopOpacity="0.8" />
            </radialGradient>
          </React.Fragment>
        ))}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="dot-glow" x="-100%" y="-100%" width="300%" height="300%">
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
        
        // Vary curve intensity based on connection
        const isCrossConnection = !['you'].includes(connection.from);
        const curveIntensity = isCrossConnection ? 0.4 : 0.15;
        
        const path = createCurvePath(from, to, curveIntensity);
        const midpoint = getMidpoint(from, to, curveIntensity);
        
        return (
          <g key={`${connection.from}-${connection.to}-${index}`}>
            {/* Glow effect line */}
            <path
              d={path}
              fill="none"
              stroke={`url(#gradient-${connection.color})`}
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.2"
              filter="url(#glow)"
            />
            {/* Main line */}
            <path
              d={path}
              fill="none"
              stroke={`url(#gradient-${connection.color})`}
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.8"
            />
            {/* Midpoint dot */}
            <circle
              cx={midpoint.x}
              cy={midpoint.y}
              r="5"
              fill={`url(#dot-gradient-${connection.color})`}
              filter="url(#dot-glow)"
              className="animate-pulse-glow"
            />
            {/* Start dot */}
            <circle
              cx={from.x}
              cy={from.y}
              r="4"
              fill={colorMap[connection.color].start}
              opacity="0.9"
            />
            {/* End dot */}
            <circle
              cx={to.x}
              cy={to.y}
              r="4"
              fill={colorMap[connection.color].end}
              opacity="0.9"
            />
          </g>
        );
      })}
    </svg>
  );
};
