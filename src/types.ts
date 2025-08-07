interface Note {
  id: string;
  content: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'todo' | 'inProgress' | 'done';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  notes: Note[];
}

export const API_URL = 'http://localhost:3001/api';
