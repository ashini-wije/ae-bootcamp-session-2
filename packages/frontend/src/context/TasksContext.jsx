import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { tagsClient, tasksClient } from '../api/tasksClient';

const TasksContext = createContext(null);

const DEFAULT_FILTERS = {
  status: 'all',
  sort: 'due',
  priority: '',
  tag: '',
  due: '',
  q: '',
};

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async (currentFilters) => {
    try {
      setLoading(true);
      setError(null);
      const [taskList, tagList] = await Promise.all([
        tasksClient.list(currentFilters),
        tagsClient.list(),
      ]);
      setTasks(taskList);
      setTags(tagList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh(filters);
  }, [filters, refresh]);

  const addTask = useCallback(
    async (data) => {
      await tasksClient.create(data);
      await refresh(filters);
    },
    [filters, refresh],
  );

  const updateTask = useCallback(
    async (id, data) => {
      await tasksClient.update(id, data);
      await refresh(filters);
    },
    [filters, refresh],
  );

  const removeTask = useCallback(
    async (id) => {
      await tasksClient.remove(id);
      await refresh(filters);
    },
    [filters, refresh],
  );

  const value = useMemo(
    () => ({
      tasks,
      tags,
      filters,
      setFilters,
      loading,
      error,
      addTask,
      updateTask,
      removeTask,
      refresh: () => refresh(filters),
    }),
    [tasks, tags, filters, loading, error, addTask, updateTask, removeTask, refresh],
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be used within a TasksProvider');
  return ctx;
}

export { DEFAULT_FILTERS };
