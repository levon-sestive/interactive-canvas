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
  briefcase: <Briefcase className="w-4 h-4" />,
  heart: <Heart className="w-4 h-4" />,
  users: <Users className="w-4 h-4" />,
  home: <Home className="w-4 h-4" />,
  building: <Building className="w-4 h-4" />,
  calendar: <Calendar className="w-4 h-4" />,
  flame: <Flame className="w-4 h-4" />,
  alert: <AlertCircle className="w-4 h-4" />,
  brain: <Brain className="w-4 h-4" />,
  frown: <Frown className="w-4 h-4" />,
};

const categoryColors: Record<NodeCategory, string> = {
  people: 'node-glow-people border-node-people/40',
  places: 'node-glow-places border-node-places/40',
  events: 'node-glow-events border-node-events/40',
  emotions: 'node-glow-emotions border-node-emotions/40',
  center: 'node-glow-center border-node-center/50',
};

const iconBgColors: Record<NodeCategory, string> = {
  people: 'bg-node-people/30 text-node-people',
  places: 'bg-node-places/30 text-node-places',
  events: 'bg-node-events/30 text-node-events',
  emotions: 'bg-node-emotions/30 text-node-emotions',
  center: 'bg-node-center/30 text-node-center',
};

const statusColors: Record<NodeStatus, { bg: string; text: string; icon?: React.ReactNode }> = {
  frequent: { bg: 'bg-node-events/20', text: 'text-node-events', icon: <Flame className="w-3 h-3" /> },
  recent: { bg: 'bg-node-emotions/20', text: 'text-node-emotions', icon: <Heart className="w-3 h-3" /> },
  quiet: { bg: 'bg-muted/50', text: 'text-muted-foreground' },
  'time-sensitive': { bg: 'bg-node-events/20', text: 'text-node-events', icon: <Flame className="w-3 h-3" /> },
};

export const MindMapNode: React.FC<MindMapNodeProps> = ({ node, onDrag, onClick, isSelected }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
      if (isDragging) {
        setIsDragging(false);
      }
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
        select-none
      `}
      style={{
        left: node.x,
        top: node.y,
        animationDelay: `${Math.random() * 0.3}s`,
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        onClick(node.id);
      }}
    >
      {isCenter ? (
        <div
          className={`
            node-card ${categoryColors[node.category]}
            w-24 h-24 rounded-full flex flex-col items-center justify-center gap-1
            ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
            ${isDragging ? 'cursor-grabbing scale-105' : 'cursor-grab'}
            transition-transform duration-150
          `}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBgColors[node.category]}`}>
            <User className="w-6 h-6" />
          </div>
          <span className="text-sm font-display font-semibold text-foreground">{node.label}</span>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-1">
          <div
            className={`
              node-card ${categoryColors[node.category]}
              px-3 py-2 flex items-center gap-2 min-w-[100px]
              ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
              ${isDragging ? 'cursor-grabbing scale-105' : 'cursor-grab'}
              transition-transform duration-150
            `}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconBgColors[node.category]} flex-shrink-0`}>
              {iconMap[node.icon]}
            </div>
            <span className="text-sm font-medium text-foreground whitespace-nowrap">{node.label}</span>
          </div>
          
          {/* Status badge below the node */}
          {node.status && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${statusColors[node.status].bg} ${statusColors[node.status].text}`}>
              {statusColors[node.status].icon}
              <span>{node.status}</span>
            </div>
          )}
          
          {/* Sub label */}
          {node.subLabel && (
            <span className="text-xs text-muted-foreground pl-1">{node.subLabel}</span>
          )}
        </div>
      )}
    </div>
  );
};
