import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import Filters from '../components/Filters';

const baseFilters = {
  status: 'all',
  sort: 'due',
  priority: '',
  tag: '',
  due: '',
  q: '',
};

function renderFilters(overrides = {}) {
  const onChange = jest.fn();
  render(
    <Filters
      filters={{ ...baseFilters, ...overrides }}
      tags={[{ id: 1, name: 'work' }]}
      onChange={onChange}
    />,
  );
  return { onChange };
}

describe('Filters', () => {
  it('renders all status tabs', () => {
    renderFilters();
    expect(screen.getByRole('tab', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Active' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Completed' })).toBeInTheDocument();
  });

  it('calls onChange with the new status when a tab is clicked', async () => {
    const user = userEvent.setup();
    const { onChange } = renderFilters();
    await user.click(screen.getByRole('tab', { name: 'Active' }));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ status: 'active' }));
  });

  it('calls onChange when the search field is typed in', async () => {
    const user = userEvent.setup();
    const { onChange } = renderFilters();
    await user.type(screen.getByLabelText('Search'), 'a');
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ q: 'a' }));
  });

  it('includes the provided tags in the tag filter options', async () => {
    const user = userEvent.setup();
    renderFilters();
    await user.click(screen.getByLabelText('Tag'));
    expect(await screen.findByRole('option', { name: '#work' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'All tags' })).toBeInTheDocument();
  });
});
