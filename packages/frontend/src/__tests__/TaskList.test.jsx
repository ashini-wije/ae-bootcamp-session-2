import { render, screen } from '@testing-library/react';
import React from 'react';

import TaskList from '../components/TaskList';

const noop = () => {};

describe('TaskList', () => {
  it('renders an empty state when there are no tasks', () => {
    render(<TaskList tasks={[]} onToggle={noop} onEdit={noop} onDelete={noop} />);
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
  });

  it('renders one item per task in given order', () => {
    const tasks = [
      { id: 1, title: 'First', priority: 'low', tags: [], completed: false },
      { id: 2, title: 'Second', priority: 'high', tags: [], completed: false },
    ];
    render(<TaskList tasks={tasks} onToggle={noop} onEdit={noop} onDelete={noop} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('First');
    expect(items[1]).toHaveTextContent('Second');
  });
});
