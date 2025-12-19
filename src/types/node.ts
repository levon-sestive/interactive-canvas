export type NodeCategory = 'people' | 'places' | 'events' | 'emotions' | 'center';

export type NodeStatus = 'frequent' | 'recent' | 'quiet' | 'time-sensitive';

export interface MindMapNode {
  id: string;
  label: string;
  category: NodeCategory;
  icon: string;
  status?: NodeStatus;
  subLabel?: string;
  x: number;
  y: number;
}

export interface Connection {
  from: string;
  to: string;
  color: 'orange' | 'pink' | 'blue' | 'coral';
}
