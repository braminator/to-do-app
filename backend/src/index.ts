import { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';

config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Types
interface Note {
  id: string;
  content: string;
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'todo' | 'inProgress' | 'done';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  notes: Note[];
}

// In-memory storage (replace with a database in production)
let tasks: Task[] = [];

// Routes
app.get('/api/tasks', (req: Request, res: Response) => {
  res.json(tasks);
});

app.post('/api/tasks', (req: Request, res: Response) => {
  const task: Task = {
    id: Date.now().toString(),
    ...req.body,
  };
  tasks.push(task);
  res.status(201).json(task);
});

app.put('/api/tasks/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
  res.json(tasks[taskIndex]);
});

app.delete('/api/tasks/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  tasks = tasks.filter(task => task.id !== id);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
