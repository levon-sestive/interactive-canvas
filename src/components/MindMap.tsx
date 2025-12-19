import React, { useState, useCallback } from 'react';
import { MindMapNode as NodeType, Connection } from '@/types/node';
import { MindMapNode } from './MindMapNode';
import { ConnectionLines } from './ConnectionLines';
import { CategoryLabel } from './CategoryLabel';
import { toast } from 'sonner';

const initialNodes: NodeType[] = [
  // Center node
  { id: 'you', label: 'You', category: 'center', icon: 'user', x: 500, y: 350 },
  
  // People
  { id: 'boss', label: 'Boss', category: 'people', icon: 'briefcase', status: 'frequent', x: 180, y: 160 },
  { id: 'wife', label: 'Wife', category: 'people', icon: 'heart', status: 'recent', x: 160, y: 280 },
  { id: 'peers', label: 'Peers', category: 'people', icon: 'users', status: 'quiet', x: 200, y: 400 },
  
  // Places
  { id: 'workplace', label: 'Workplace', category: 'places', icon: 'building', x: 180, y: 520 },
  { id: 'home', label: 'Home', category: 'places', icon: 'home', status: 'quiet', x: 240, y: 620 },
  
  // Events
  { id: 'interview', label: 'Upcoming Interview', category: 'events', icon: 'alert', status: 'time-sensitive', x: 780, y: 140 },
  
  // Emotions
  { id: 'fear1', label: 'Fear', category: 'emotions', icon: 'flame', status: 'frequent', x: 800, y: 280 },
  { id: 'fear2', label: 'Fear', category: 'emotions', icon: 'alert', status: 'frequent', subLabel: 'Together in the bedroom', x: 820, y: 380 },
  { id: 'pain', label: 'Pain', category: 'emotions', icon: 'heart', x: 780, y: 520 },
  { id: 'anger', label: 'Anger', category: 'emotions', icon: 'brain', x: 700, y: 600 },
  { id: 'overwhelmed', label: 'Overwhelmed', category: 'emotions', icon: 'frown', x: 820, y: 660 },
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
];

const categoryLabels = [
  { label: 'People', x: 120, y: 100 },
  { label: 'Places', x: 140, y: 470 },
  { label: 'Events', x: 820, y: 80 },
  { label: 'Emotions', x: 850, y: 230 },
];

export const MindMap: React.FC = () => {
  const [nodes, setNodes] = useState<NodeType[]>(initialNodes);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const handleDrag = useCallback((id: string, x: number, y: number) => {
    setNodes(prev => prev.map(node => 
      node.id === id ? { ...node, x, y } : node
    ));
  }, []);

  const handleClick = useCallback((id: string) => {
    setSelectedNode(prev => prev === id ? null : id);
    const node = nodes.find(n => n.id === id);
    if (node) {
      toast(`Selected: ${node.label}`, {
        description: node.status ? `Status: ${node.status}` : `Category: ${node.category}`,
      });
    }
  }, [nodes]);

  return (
    <div className="relative w-full h-screen overflow-hidden cosmic-bg">
      {/* Animated stars background */}
      <div className="absolute inset-0 stars opacity-60" />
      <div className="absolute inset-0 stars opacity-40" style={{ backgroundPosition: '100px 50px' }} />
      <div className="absolute inset-0 stars opacity-30" style={{ backgroundPosition: '50px 100px' }} />
      
      {/* Connection lines */}
      <ConnectionLines connections={initialConnections} nodes={nodes} />
      
      {/* Category labels */}
      {categoryLabels.map((label, index) => (
        <CategoryLabel key={index} {...label} />
      ))}
      
      {/* Nodes */}
      {nodes.map(node => (
        <MindMapNode
          key={node.id}
          node={node}
          onDrag={handleDrag}
          onClick={handleClick}
          isSelected={selectedNode === node.id}
        />
      ))}

      {/* Instructions */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-sm text-muted-foreground backdrop-blur-sm bg-background/30 px-4 py-2 rounded-full">
          Click to select • Drag to move nodes
        </p>
      </div>
    </div>
  );
};
