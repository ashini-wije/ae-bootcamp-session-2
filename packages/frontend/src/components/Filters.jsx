import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, MenuItem, Stack, Tab, Tabs, TextField } from '@mui/material';
import React from 'react';

const STATUS_TABS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

const SORT_OPTIONS = [
  { value: 'due', label: 'Due date' },
  { value: 'priority', label: 'Priority' },
  { value: 'created', label: 'Recently added' },
  { value: 'title', label: 'Title (A–Z)' },
];

const PRIORITY_OPTIONS = [
  { value: '', label: 'Any priority' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const DUE_OPTIONS = [
  { value: '', label: 'Any time' },
  { value: 'today', label: 'Due today' },
  { value: 'week', label: 'Due this week' },
  { value: 'overdue', label: 'Overdue' },
];

function Filters({ filters, tags, onChange }) {
  const update = (field) => (event) => onChange({ ...filters, [field]: event.target.value });

  const tagOptions = [
    { value: '', label: 'All tags' },
    ...tags.map((t) => ({
      value: t.name,
      label: `#${t.name}`,
    })),
  ];

  return (
    <Stack spacing={2} sx={{ mb: 2 }}>
      <Tabs
        value={filters.status}
        onChange={(_e, value) => onChange({ ...filters, status: value })}
        aria-label="Filter tasks by status"
      >
        {STATUS_TABS.map((t) => (
          <Tab key={t.value} value={t.value} label={t.label} />
        ))}
      </Tabs>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Search"
          value={filters.q}
          onChange={update('q')}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Sort by"
          select
          value={filters.sort}
          onChange={update('sort')}
          sx={{ minWidth: 160 }}
        >
          {SORT_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Priority"
          select
          value={filters.priority}
          onChange={update('priority')}
          sx={{ minWidth: 160 }}
        >
          {PRIORITY_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Due"
          select
          value={filters.due}
          onChange={update('due')}
          sx={{ minWidth: 160 }}
        >
          {DUE_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Tag"
          select
          value={filters.tag}
          onChange={update('tag')}
          sx={{ minWidth: 160 }}
        >
          {tagOptions.map((o) => (
            <MenuItem key={o.value || 'all'} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </Stack>
  );
}

export default Filters;
