const express = require('express');

const service = require('../services/tasks');
const {
  parseId,
  validateCreateTask,
  validateListQuery,
  validateUpdateTask,
} = require('../validators/tasks');

function createTasksRouter(db) {
  const router = express.Router();

  router.get('/', (req, res) => {
    const validation = validateListQuery(req.query);
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }
    const tasks = service.listTasks(db, req.query);
    res.json(tasks);
  });

  router.get('/:id', (req, res) => {
    const id = parseId(req.params.id);
    if (id == null) return res.status(400).json({ error: 'Valid task ID is required' });
    const task = service.getTask(db, id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  });

  router.post('/', (req, res) => {
    const validation = validateCreateTask(req.body);
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }
    const task = service.createTask(db, req.body);
    res.status(201).json(task);
  });

  router.patch('/:id', (req, res) => {
    const id = parseId(req.params.id);
    if (id == null) return res.status(400).json({ error: 'Valid task ID is required' });
    const validation = validateUpdateTask(req.body);
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }
    const task = service.updateTask(db, id, req.body);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  });

  router.delete('/:id', (req, res) => {
    const id = parseId(req.params.id);
    if (id == null) return res.status(400).json({ error: 'Valid task ID is required' });
    const deleted = service.deleteTask(db, id);
    if (!deleted) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted successfully', id });
  });

  return router;
}

module.exports = createTasksRouter;
