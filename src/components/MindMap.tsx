import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MindMapNode as NodeType, Connection } from '@/types/node';
import { MindMapNode } from './MindMapNode';
import { ConnectionLines } from './ConnectionLines';
import { CategoryGroup } from './CategoryGroup';
import { toast } from 'sonner';

const initialNodes: NodeType[] = [
  // Center node
  { id: 'you', label: 'You', category: 'center', icon: 'user', x: 500, y: 350 },
  
  // People
  { id: 'boss', label: 'Boss', category: 'people', icon: 'briefcase', status: 'frequent', x: 200, y: 180 },
  { id: 'wife', label: 'Wife', category: 'people', icon: 'heart', status: 'recent', x: 180, y: 280 },
  { id: 'peers', label: 'Peers', category: 'people', icon: 'users', status: 'quiet', x: 200, y: 380 },
  
  // Places
  { id: 'workplace', label: 'Workplace', category: 'places', icon: 'building', x: 200, y: 540 },
  { id: 'home', label: 'Home', category: 'places', icon: 'home', status: 'quiet', x: 220, y: 620 },
  
  // Events
  { id: 'interview', label: 'Upcoming Interview', category: 'events', icon: 'alert', status: 'time-sensitive', x: 780, y: 160 },
  
  // Emotions (right side)
  { id: 'fear1', label: 'Fear', category: 'emotions', icon: 'flame', status: 'frequent', x: 800, y: 300 },
  { id: 'fear2', label: 'Fear', category: 'emotions', icon: 'alert', status: 'frequent', subLabel: 'Together in the bedroom', x: 820, y: 400 },
  { id: 'pain', label: 'Pain', category: 'emotions', icon: 'heart', x: 780, y: 540 },
  { id: 'anger', label: 'Anger', category: 'emotions', icon: 'brain', x: 720, y: 620 },
  { id: 'overwhelmed', label: 'Overwhelmed', category: 'emotions', icon: 'frown', x: 840, y: 680 },
];

const initialConnections: Connection[] = [
  // From center to People
  { from: 'you', to: 'boss', color: 'orange' },
  { from: 'you', to: 'wife', color: 'orange' },
  { from: 'you', to: 'peers', color: 'orange' },
  
  // From center to Places
  { from: 'you', to: 'workplace', color: 'blue' },
  { from: 'you', to: 'home', color: 'blue' },
  
  // From center to Events
  { from: 'you', to: 'interview', color: 'coral' },
  
  // From center to Emotions
  { from: 'you', to: 'fear1', color: 'pink' },
  { from: 'you', to: 'fear2', color: 'pink' },
  { from: 'you', to: 'pain', color: 'pink' },
  { from: 'you', to: 'anger', color: 'pink' },
  { from: 'you', to: 'overwhelmed', color: 'pink' },
  
  // Cross connections (emotions to people)
  { from: 'pain', to: 'boss', color: 'coral' },
  { from: 'anger', to: 'wife', color: 'coral' },
  { from: 'anger', to: 'boss', color: 'coral' },
];

const categoryGroups = [
  { label: 'People', x: 80, y: 120, width: 280, height: 320 },
  { label: 'Places', x: 80, y: 480, width: 280, height: 200 },
  { label: 'Events', x: 680, y: 80, width: 260, height: 140 },
  { label: 'Emotions', x: 660, y: 240, width: 280, height: 500 },
];

export const MindMap: React.FC = () => {
  const [nodes, setNodes] = useState<NodeType[]>(initialNodes);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDrag = useCallback((id: string, x: number, y: number) => {
    setNodes(prev => prev.map(node => 
      node.id === id ? { ...node, x: x - panOffset.x, y: y - panOffset.y } : node
    ));
  }, [panOffset]);

  const handleClick = useCallback((id: string) => {
    setSelectedNode(prev => prev === id ? null : id);
    const node = nodes.find(n => n.id === id);
    if (node) {
      toast(`Selected: ${node.label}`, {
        description: node.status ? `Status: ${node.status}` : `Category: ${node.category}`,
      });
    }
  }, [nodes]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).classList.contains('pan-area')) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isPanning) {
        setPanOffset({
          x: e.clientX - startPan.x,
          y: e.clientY - startPan.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsPanning(false);
    };

    if (isPanning) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPanning, startPan]);

  // Adjust node positions with pan offset
  const adjustedNodes = nodes.map(node => ({
    ...node,
    x: node.x + panOffset.x,
    y: node.y + panOffset.y,
  }));

  // Adjust category groups with pan offset
  const adjustedGroups = categoryGroups.map(group => ({
    ...group,
    x: group.x + panOffset.x,
    y: group.y + panOffset.y,
  }));

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-screen overflow-hidden cosmic-bg ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseDown={handleMouseDown}
    >
      {/* Animated stars background */}
      <div className="absolute inset-0 stars opacity-60 pan-area" />
      <div className="absolute inset-0 stars opacity-40 pan-area" style={{ backgroundPosition: '100px 50px' }} />
      <div className="absolute inset-0 stars opacity-30 pan-area" style={{ backgroundPosition: '50px 100px' }} />
      
      {/* Category groups (dashed borders) */}
      {adjustedGroups.map((group, index) => (
        <CategoryGroup key={index} {...group} />
      ))}
      
      {/* Connection lines */}
      <ConnectionLines connections={initialConnections} nodes={adjustedNodes} />
      
      {/* Nodes */}
      {adjustedNodes.map(node => (
        <MindMapNode
          key={node.id}
          node={node}
          onDrag={handleDrag}
          onClick={handleClick}
          isSelected={selectedNode === node.id}
        />
      ))}

      {/* Instructions */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center z-30">
        <p className="text-sm text-muted-foreground backdrop-blur-sm bg-background/30 px-4 py-2 rounded-full border border-border/30">
          Click to select • Drag nodes to move • Drag background to pan
        </p>
      </div>
    </div>
  );
};
