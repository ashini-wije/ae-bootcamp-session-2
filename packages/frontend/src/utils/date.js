import { differenceInCalendarDays, isToday, parseISO } from 'date-fns';

export function getDueState(dueDate, completed) {
  if (!dueDate || completed) return 'none';
  const date = parseISO(dueDate);
  if (Number.isNaN(date.getTime())) return 'none';
  if (isToday(date)) return 'today';
  if (differenceInCalendarDays(date, new Date()) < 0) return 'overdue';
  return 'upcoming';
}

export function formatDueDate(dueDate) {
  if (!dueDate) return '';
  const date = parseISO(dueDate);
  if (Number.isNaN(date.getTime())) return dueDate;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
