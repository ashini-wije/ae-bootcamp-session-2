import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Card,
  CardContent,
  Checkbox,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';

import DueDateChip from './DueDateChip';

const PRIORITY_COLORS = { high: 'error', medium: 'warning', low: 'success' };

function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const { id, title, description, due_date, priority, tags, completed } = task;
  const titleId = `task-${id}-title`;

  return (
    <Card
      data-testid={`task-${id}`}
      elevation={1}
      sx={{
        opacity: completed ? 0.6 : 1,
        borderLeft: 6,
        borderColor: `${PRIORITY_COLORS[priority] || 'grey'}.main`,
      }}
    >
      <CardContent>
        <Stack direction="row" alignItems="flex-start" spacing={1}>
          <Checkbox
            checked={completed}
            onChange={(e) => onToggle(id, e.target.checked)}
            inputProps={{ 'aria-labelledby': titleId }}
          />
          <Stack flex={1} spacing={1}>
            <Typography
              id={titleId}
              variant="body1"
              sx={{
                fontWeight: 600,
                textDecoration: completed ? 'line-through' : 'none',
              }}
            >
              {title}
            </Typography>
            {description && (
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            )}
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <DueDateChip dueDate={due_date} completed={completed} />
              <Chip
                size="small"
                label={`Priority: ${priority}`}
                color={PRIORITY_COLORS[priority] || 'default'}
                variant="outlined"
              />
              {tags?.map((tag) => (
                <Chip key={tag} size="small" label={`#${tag}`} variant="outlined" />
              ))}
            </Stack>
          </Stack>
          <Stack direction="row">
            <Tooltip title="Edit task">
              <IconButton aria-label={`Edit task: ${title}`} onClick={() => onEdit(task)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete task">
              <IconButton
                aria-label={`Delete task: ${title}`}
                color="error"
                onClick={() => onDelete(task)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default TaskItem;
