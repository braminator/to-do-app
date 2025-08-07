import { useState } from 'react';
import { type Task } from '../types';
import { Card, CardContent, Typography, Box, Chip, IconButton, Badge } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Chat as ChatIcon } from '@mui/icons-material';
import { NotesDialog } from './NotesDialog';
import { format } from 'date-fns';

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

interface ExtendedTaskListProps extends TaskListProps {
  onAddNote: (taskId: string, content: string) => void;
}

export const TaskList = ({ tasks, onDelete, onEdit, onAddNote }: ExtendedTaskListProps) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleCloseNotes = () => {
    setSelectedTask(null);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
    }
  };

  return (
    <>
      <Box sx={{ 
        display: 'grid', 
        gap: 3,
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
          md: 'repeat(3, 1fr)', 
          lg: 'repeat(4, 1fr)' 
        }
      }}>
        {tasks.map((task) => (
          <Box key={task.id}>
            <Card sx={{ height: '100%', backgroundColor: '#fff' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" component="div" sx={{ color: 'text.primary' }}>
                    {task.title}
                  </Typography>
                  <Box>
                    <IconButton 
                      size="small" 
                      onClick={() => setSelectedTask(task)}
                      sx={{ mr: 1 }}
                    >
                      <Badge badgeContent={task.notes?.length || 0} color="primary">
                        <ChatIcon />
                      </Badge>
                    </IconButton>
                    <IconButton size="small" onClick={() => onEdit(task)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => onDelete(task.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography color="text.secondary" sx={{ mb: 1.5 }}>
                  Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: 'text.primary' }}>
                  {task.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  <Chip 
                    label={task.status}
                    size="small"
                    color={task.status === 'done' ? 'success' : task.status === 'inProgress' ? 'warning' : 'default'}
                  />
                  <Chip 
                    label={task.priority}
                    size="small"
                    color={getPriorityColor(task.priority)}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {task.tags.map((tag, index) => (
                    <Chip key={index} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
      
      {selectedTask && (
        <NotesDialog
          task={selectedTask}
          open={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onAddNote={onAddNote}
        />
      )}
    </>
  );
};
