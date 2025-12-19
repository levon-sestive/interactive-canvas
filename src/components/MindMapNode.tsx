import React, { useRef, useEffect, useState } from 'react';
import { MindMapNode as NodeType, NodeCategory, NodeStatus } from '@/types/node';
import { User, Briefcase, Heart, Users, Home, Building, Calendar, Flame, AlertCircle, Brain, Frown } from 'lucide-react';

interface MindMapNodeProps {
  node: NodeType;
  onDrag: (id: string, x: number, y: number) => void;
  onClick: (id: string) => void;
  isSelected: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  user: <User className="w-5 h-5" />,
  briefcase: <Briefcase className="w-5 h-5" />,
  heart: <Heart className="w-5 h-5" />,
  users: <Users className="w-5 h-5" />,
  home: <Home className="w-5 h-5" />,
  building: <Building className="w-5 h-5" />,
  calendar: <Calendar className="w-5 h-5" />,
  flame: <Flame className="w-5 h-5" />,
  alert: <AlertCircle className="w-5 h-5" />,
  brain: <Brain className="w-5 h-5" />,
  frown: <Frown className="w-5 h-5" />,
};

const categoryColors: Record<NodeCategory, string> = {
  people: 'node-glow-people border-node-people/30',
  places: 'node-glow-places border-node-places/30',
  events: 'node-glow-events border-node-events/30',
  emotions: 'node-glow-emotions border-node-emotions/30',
  center: 'node-glow-center border-node-center/30',
};

const iconBgColors: Record<NodeCategory, string> = {
  people: 'bg-node-people/20 text-node-people',
  places: 'bg-node-places/20 text-node-places',
  events: 'bg-node-events/20 text-node-events',
  emotions: 'bg-node-emotions/20 text-node-emotions',
  center: 'bg-node-center/20 text-node-center',
};

const statusStyles: Record<NodeStatus, string> = {
  frequent: 'status-frequent',
  recent: 'status-recent',
  quiet: 'status-quiet',
  'time-sensitive': 'status-time-sensitive',
};

export const MindMapNode: React.FC<MindMapNodeProps> = ({ node, onDrag, onClick, isSelected }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const rect = nodeRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && nodeRef.current) {
        const parent = nodeRef.current.parentElement;
        if (parent) {
          const parentRect = parent.getBoundingClientRect();
          const x = e.clientX - parentRect.left - dragOffset.x;
          const y = e.clientY - parentRect.top - dragOffset.y;
          onDrag(node.id, x, y);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, node.id, onDrag]);

  const isCenter = node.category === 'center';

  return (
    <div
      ref={nodeRef}
      className={`
        absolute transform -translate-x-1/2 -translate-y-1/2 
        ${isCenter ? 'z-20' : 'z-10'}
        animate-fade-in
      `}
      style={{
        left: node.x,
        top: node.y,
        animationDelay: `${Math.random() * 0.5}s`,
      }}
      onMouseDown={handleMouseDown}
      onClick={() => onClick(node.id)}
    >
      {isCenter ? (
        <div
          className={`
            node-card ${categoryColors[node.category]}
            w-28 h-28 rounded-full flex flex-col items-center justify-center gap-2
            ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
          `}
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${iconBgColors[node.category]}`}>
            {iconMap[node.icon]}
          </div>
          <span className="text-sm font-display font-semibold text-foreground">{node.label}</span>
        </div>
      ) : (
        <div
          className={`
            node-card ${categoryColors[node.category]}
            px-4 py-3 flex items-center gap-3 min-w-[140px]
            ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
          `}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBgColors[node.category]} flex-shrink-0`}>
            {iconMap[node.icon]}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-foreground">{node.label}</span>
            {node.status && (
              <span className={`status-badge ${statusStyles[node.status]}`}>
                {node.status}
              </span>
            )}
            {node.subLabel && (
              <span className="text-xs text-muted-foreground">{node.subLabel}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
