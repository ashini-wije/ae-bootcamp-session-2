import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import TaskItem from '../components/TaskItem';

const baseTask = {
  id: 1,
  title: 'Write tests',
  description: 'Cover the happy paths',
  due_date: null,
  priority: 'medium',
  tags: ['work'],
  completed: false,
};

function renderItem(overrides = {}) {
  const onToggle = jest.fn();
  const onEdit = jest.fn();
  const onDelete = jest.fn();
  render(
    <TaskItem
      task={{ ...baseTask, ...overrides }}
      onToggle={onToggle}
      onEdit={onEdit}
      onDelete={onDelete}
    />,
  );
  return { onToggle, onEdit, onDelete };
}

describe('TaskItem', () => {
  it('renders title, description, priority and tags', () => {
    renderItem();
    expect(screen.getByText('Write tests')).toBeInTheDocument();
    expect(screen.getByText('Cover the happy paths')).toBeInTheDocument();
    expect(screen.getByText('Priority: medium')).toBeInTheDocument();
    expect(screen.getByText('#work')).toBeInTheDocument();
  });

  it('calls onToggle when the checkbox is clicked', async () => {
    const user = userEvent.setup();
    const { onToggle } = renderItem();
    await user.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledWith(1, true);
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    const { onEdit } = renderItem();
    await user.click(screen.getByRole('button', { name: /edit task: write tests/i }));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const { onDelete } = renderItem();
    await user.click(screen.getByRole('button', { name: /delete task: write tests/i }));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('shows overdue chip when due date is in the past and not completed', () => {
    renderItem({ due_date: '2000-01-01' });
    expect(screen.getByText(/overdue/i)).toBeInTheDocument();
  });

  it('does not show overdue chip when task is completed', () => {
    renderItem({ due_date: '2000-01-01', completed: true });
    expect(screen.queryByText(/overdue/i)).not.toBeInTheDocument();
  });
});
