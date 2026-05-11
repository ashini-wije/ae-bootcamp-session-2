import EventIcon from '@mui/icons-material/Event';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import TodayIcon from '@mui/icons-material/Today';
import { Chip } from '@mui/material';
import React from 'react';

import { formatDueDate, getDueState } from '../utils/date';

const STATE_PROPS = {
  overdue: { color: 'error', icon: <EventBusyIcon />, label: 'Overdue' },
  today: { color: 'warning', icon: <TodayIcon />, label: 'Due today' },
  upcoming: { color: 'default', icon: <EventIcon />, label: 'Upcoming' },
};

function DueDateChip({ dueDate, completed }) {
  if (!dueDate) return null;
  const state = getDueState(dueDate, completed);
  const variantProps = STATE_PROPS[state] || STATE_PROPS.upcoming;
  const formatted = formatDueDate(dueDate);

  return (
    <Chip
      size="small"
      icon={variantProps.icon}
      label={`${variantProps.label}: ${formatted}`}
      color={variantProps.color}
      aria-label={`${variantProps.label}: ${formatted}`}
      variant={state === 'upcoming' ? 'outlined' : 'filled'}
    />
  );
}

export default DueDateChip;
