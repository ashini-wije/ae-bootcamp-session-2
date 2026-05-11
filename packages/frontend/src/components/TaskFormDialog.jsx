import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, parseISO } from 'date-fns';
import React, { useEffect, useState } from 'react';

const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const EMPTY_FORM = {
  title: '',
  description: '',
  due_date: null,
  priority: 'medium',
  tagsInput: '',
};

function toFormState(task) {
  if (!task) return EMPTY_FORM;
  return {
    title: task.title || '',
    description: task.description || '',
    due_date: task.due_date ? parseISO(task.due_date) : null,
    priority: task.priority || 'medium',
    tagsInput: (task.tags || []).join(', '),
  };
}

function TaskFormDialog({ open, task, onClose, onSubmit }) {
  const isEdit = Boolean(task);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(toFormState(task));
      setErrors({});
    }
  }, [open, task]);

  const update = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedTitle = form.title.trim();
    if (!trimmedTitle) {
      setErrors({ title: 'Title is required' });
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        title: trimmedTitle,
        description: form.description.trim() || null,
        due_date: form.due_date ? format(form.due_date, 'yyyy-MM-dd') : null,
        priority: form.priority,
        tags: form.tagsInput
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };
      await onSubmit(payload);
      onClose();
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle>{isEdit ? 'Edit task' : 'Add a new task'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              required
              value={form.title}
              onChange={update('title')}
              error={Boolean(errors.title)}
              helperText={errors.title || ' '}
              inputProps={{ 'aria-invalid': Boolean(errors.title) }}
              autoFocus
            />
            <TextField
              label="Description"
              multiline
              minRows={2}
              value={form.description}
              onChange={update('description')}
            />
            <DatePicker
              label="Due date"
              value={form.due_date}
              onChange={(value) => setForm((prev) => ({ ...prev, due_date: value }))}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <TextField label="Priority" select value={form.priority} onChange={update('priority')}>
              {PRIORITIES.map((p) => (
                <MenuItem key={p.value} value={p.value}>
                  {p.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Tags (comma-separated)"
              value={form.tagsInput}
              onChange={update('tagsInput')}
              helperText="e.g. work, urgent"
            />
            {errors.form && (
              <p role="alert" style={{ color: 'var(--mui-palette-error-main)' }}>
                {errors.form}
              </p>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="text">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {isEdit ? 'Save changes' : 'Add task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default TaskFormDialog;
