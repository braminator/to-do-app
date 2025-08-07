import { useState, useEffect } from 'react';
import { Container, Typography, CssBaseline, ThemeProvider, createTheme, Box, Button, Modal } from '@mui/material';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { type Task } from './types';
import { API_URL } from './types';

const theme = createTheme({
  palette: {
    background: {
      default: '#F9FAFB',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
    },
    primary: {
      main: '#3B82F6',
      dark: '#2563EB',
    },
    error: {
      main: '#EF4444',
    },
    grey: {
      200: '#E5E7EB',
      300: '#D1D5DB',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#F9FAFB',
        },
      },
    },
  },
});

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = async (newTask: Omit<Task, 'id'>) => {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      const data = await response.json();
      setTasks([...tasks, data]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
      });
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEditTask = async (task: Task) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      const updatedTask = await response.json();
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleAddNote = async (taskId: string, content: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const updatedTask = {
        ...task,
        notes: [
          ...(task.notes || []),
          {
            id: Date.now().toString(),
            content,
            createdAt: new Date().toISOString(),
          },
        ],
      };

      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });
      
      const savedTask = await response.json();
      setTasks(tasks.map(t => t.id === taskId ? savedTask : t));
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: 4
        }}>
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '1px solid',
            borderColor: 'grey.200',
            pb: 2
          }}>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary'
              }}
            >
              Todo App
            </Typography>
            <Button
              variant="contained"
              onClick={handleOpenModal}
              sx={{
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
                px: 3,
                py: 1,
                borderRadius: 2
              }}
            >
              Add New Task
            </Button>
          </Box>

          {/* Tasks List */}
          <Box>
            <TaskList
              tasks={tasks}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
              onAddNote={handleAddNote}
            />
          </Box>
        </Box>

        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          aria-labelledby="modal-title"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{
            width: '100%',
            maxWidth: 600,
            mx: 2,
          }}>
            <TaskForm onSubmit={(task) => {
              handleAddTask(task);
              handleCloseModal();
            }} />
          </Box>
        </Modal>
      </Container>
    </ThemeProvider>
  );
}
