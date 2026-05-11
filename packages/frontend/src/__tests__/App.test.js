import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import App from '../App';
import { tagsClient, tasksClient } from '../api/tasksClient';

jest.mock('../api/tasksClient', () => ({
  tasksClient: {
    list: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
  tagsClient: {
    list: jest.fn(),
    create: jest.fn(),
  },
}));

describe('App', () => {
  beforeEach(() => {
    tasksClient.list.mockResolvedValue([
      {
        id: 1,
        title: 'Sample task',
        description: null,
        due_date: null,
        priority: 'medium',
        tags: [],
        completed: false,
      },
    ]);
    tagsClient.list.mockResolvedValue([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the app title', async () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /^todo$/i })).toBeInTheDocument();
  });

  it('renders tasks loaded from the API', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Sample task')).toBeInTheDocument();
    });
  });

  it('shows the empty state when no tasks are returned', async () => {
    tasksClient.list.mockResolvedValueOnce([]);
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
    });
  });

  it('exposes a floating action button to add a task', async () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  });
});
