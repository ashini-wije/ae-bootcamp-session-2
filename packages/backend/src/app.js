const cors = require('cors');
const express = require('express');
const morgan = require('morgan');

const { createDatabase, seed } = require('./db');
const createTagsRouter = require('./routes/tags');
const createTasksRouter = require('./routes/tasks');

function createApp({ db, log = true, seedData = true } = {}) {
  const database = db || createDatabase();
  if (seedData && !db) seed(database);

  const app = express();

  app.use(cors());
  app.use(express.json());
  if (log) app.use(morgan('dev'));

  app.get('/', (_req, res) => {
    res.status(200).json({ status: 'ok', message: 'Backend server is running' });
  });

  app.use('/api/tasks', createTasksRouter(database));
  app.use('/api/tags', createTagsRouter(database));

  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return { app, db: database };
}

module.exports = { createApp };
