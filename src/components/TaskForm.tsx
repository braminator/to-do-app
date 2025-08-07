import { useState } from 'react';
import { type Task } from '../types';
import { Button, TextField, MenuItem, Box, Paper, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id'>) => void;
}

export const TaskForm = ({ onSubmit }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<Task['status']>('todo');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    onSubmit({
      title,
      description,
      dueDate: dueDate.toISOString(),
      status,
      priority,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      notes: [], // Initialize with empty notes array
    });

    // Reset form
    setTitle('');
    setDescription('');
    setDueDate(null);
    setStatus('todo');
    setPriority('medium');
    setTags('');
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2, backgroundColor: '#fff' }}>
      <Typography variant="h5" component="h2" sx={{ mb: 3, color: 'text.primary' }}>
        Add New Task
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
          fullWidth
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Due Date"
            value={dueDate}
            onChange={(newValue) => setDueDate(newValue)}
          />
        </LocalizationProvider>
        <TextField
          select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as Task['status'])}
          fullWidth
        >
          <MenuItem value="todo">To Do</MenuItem>
          <MenuItem value="inProgress">In Progress</MenuItem>
          <MenuItem value="done">Done</MenuItem>
        </TextField>
        <TextField
          select
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Task['priority'])}
          fullWidth
        >
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </TextField>
        <TextField
          label="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          fullWidth
        />
        <Button 
          type="submit" 
          variant="contained" 
          sx={{
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
            mt: 2,
            py: 1.5
          }}
        >
          Add Task
        </Button>
      </Box>
    </Paper>
  );
};
