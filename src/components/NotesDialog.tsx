import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  IconButton
} from '@mui/material';
import { format } from 'date-fns';
import { type Task } from '../types';
import { Chat as ChatIcon } from '@mui/icons-material';

interface NotesDialogProps {
  task: Task;
  open: boolean;
  onClose: () => void;
  onAddNote: (taskId: string, content: string) => void;
}

export const NotesDialog = ({ task, open, onClose, onAddNote }: NotesDialogProps) => {
  const [newNote, setNewNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim()) {
      onAddNote(task.id, newNote);
      setNewNote('');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'background.default',
          backgroundImage: 'none'
        }
      }}
    >
      <DialogTitle sx={{ borderBottom: 1, borderColor: 'grey.300' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ChatIcon color="primary" />
          <Typography variant="h6">Notes for: {task.title}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
          {task.notes.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
              No notes yet. Add one below!
            </Typography>
          ) : (
            task.notes.map((note) => (
              <Paper
                key={note.id}
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: 'grey.200',
                  borderRadius: 2
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {note.content}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {format(new Date(note.createdAt), 'MMM d, yyyy h:mm a')}
                </Typography>
              </Paper>
            ))
          )}
        </Box>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            multiline
            rows={3}
            fullWidth
            placeholder="Add a note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#fff'
              }
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!newNote.trim()}
            sx={{
              mt: 2,
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              }
            }}
          >
            Add Note
          </Button>
        </Box>
      </DialogContent>
      <DialogActions sx={{ borderTop: 1, borderColor: 'grey.300', p: 2 }}>
        <Button onClick={onClose} sx={{ color: 'text.secondary' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
