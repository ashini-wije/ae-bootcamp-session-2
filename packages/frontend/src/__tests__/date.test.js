import { getDueState, formatDueDate } from '../utils/date';

describe('getDueState', () => {
  const today = new Date().toISOString().slice(0, 10);

  it('returns none when no date or completed', () => {
    expect(getDueState(null, false)).toBe('none');
    expect(getDueState('2000-01-01', true)).toBe('none');
  });

  it('returns today for current date', () => {
    expect(getDueState(today, false)).toBe('today');
  });

  it('returns overdue for past dates', () => {
    expect(getDueState('2000-01-01', false)).toBe('overdue');
  });

  it('returns upcoming for future dates', () => {
    expect(getDueState('2999-01-01', false)).toBe('upcoming');
  });
});

describe('formatDueDate', () => {
  it('returns empty string for null', () => {
    expect(formatDueDate(null)).toBe('');
  });

  it('formats valid dates', () => {
    expect(formatDueDate('2026-06-15')).toMatch(/2026/);
  });
});
