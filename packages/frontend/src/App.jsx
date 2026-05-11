import AddIcon from '@mui/icons-material/Add';
import {
  Alert,
  AppBar,
  Box,
  Container,
  CssBaseline,
  Fab,
  Snackbar,
  Toolbar,
  Typography,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React, { useState } from 'react';

import ConfirmDialog from './components/ConfirmDialog';
import Filters from './components/Filters';
import TaskFormDialog from './components/TaskFormDialog';
import TaskList from './components/TaskList';
import { TasksProvider, useTasks } from './context/TasksContext';
import theme from './theme';

function TodoApp() {
  const { tasks, tags, filters, setFilters, loading, error, addTask, updateTask, removeTask } =
    useTasks();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirming, setConfirming] = useState(null);
  const [toast, setToast] = useState(null);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (task) => {
    setEditing(task);
    setFormOpen(true);
  };

  const handleSubmit = async (payload) => {
    if (editing) {
      await updateTask(editing.id, payload);
      setToast({ severity: 'success', message: 'Task updated' });
    } else {
      await addTask(payload);
      setToast({ severity: 'success', message: 'Task added' });
    }
  };

  const handleToggle = async (id, checked) => {
    await updateTask(id, { completed: checked });
  };

  const confirmDelete = async () => {
    if (!confirming) return;
    const target = confirming;
    setConfirming(null);
    await removeTask(target.id);
    setToast({ severity: 'success', message: `Deleted "${target.title}"` });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
            TODO
          </Typography>
        </Toolbar>
      </AppBar>

      <Container component="main" maxWidth="md" sx={{ py: 4 }}>
        <Filters filters={filters} tags={tags} onChange={setFilters} />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Typography role="status">Loading tasks…</Typography>
        ) : (
          <TaskList
            tasks={tasks}
            onToggle={handleToggle}
            onEdit={openEdit}
            onDelete={(task) => setConfirming(task)}
          />
        )}
      </Container>

      <Fab
        color="primary"
        aria-label="Add task"
        onClick={openAdd}
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
      >
        <AddIcon />
      </Fab>

      <TaskFormDialog
        open={formOpen}
        task={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(confirming)}
        title="Delete this task?"
        message={confirming ? `"${confirming.title}" will be permanently removed.` : ''}
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setConfirming(null)}
      />

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {toast ? (
          <Alert severity={toast.severity} variant="filled" onClose={() => setToast(null)}>
            {toast.message}
          </Alert>
        ) : null}
      </Snackbar>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <TasksProvider>
          <TodoApp />
        </TasksProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
