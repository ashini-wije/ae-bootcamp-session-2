const request = require('supertest');

const { createApp } = require('../src/app');
const { createDatabase } = require('../src/db');

describe('app', () => {
  let app;
  let db;

  beforeEach(() => {
    db = createDatabase();
    ({ app } = createApp({ db, log: false }));
  });

  afterEach(() => {
    db.close();
  });

  it('responds to the health check', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: 'ok' });
  });

  it('mounts the tasks router at /api/tasks', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('mounts the tags router at /api/tags', async () => {
    const res = await request(app).get('/api/tags');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.status).toBe(404);
  });
});
