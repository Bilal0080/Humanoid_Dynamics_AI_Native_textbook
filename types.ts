
export interface Chapter {
  id: string;
  title: string;
  description: string;
  content: string;
  topics: string[];
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface KinematicPoint {
  x: number;
  y: number;
  z: number;
  label: string;
}
