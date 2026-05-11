const express = require('express');

const service = require('../services/tasks');

function createTagsRouter(db) {
  const router = express.Router();

  router.get('/', (_req, res) => {
    res.json(service.listTags(db));
  });

  router.post('/', (req, res) => {
    const { name } = req.body || {};
    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'name is required' });
    }
    const tag = service.createTag(db, name);
    res.status(201).json(tag);
  });

  return router;
}

module.exports = createTagsRouter;
