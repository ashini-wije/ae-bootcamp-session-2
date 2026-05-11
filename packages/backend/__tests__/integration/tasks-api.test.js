const request = require('supertest');

const { createApp } = require('../../src/app');
const { createDatabase } = require('../../src/db');

describe('Tasks API', () => {
  let app;
  let db;

  beforeEach(() => {
    db = createDatabase();
    ({ app } = createApp({ db, log: false }));
  });

  afterEach(() => {
    db.close();
  });

  describe('POST /api/tasks', () => {
    it('creates a task and returns 201', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'New task', priority: 'high', tags: ['x'] });
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({ title: 'New task', priority: 'high', completed: false });
      expect(res.body.tags).toEqual(['x']);
    });

    it('returns 400 when title is missing', async () => {
      const res = await request(app).post('/api/tasks').send({});
      expect(res.status).toBe(400);
      expect(res.body.errors).toContain('title is required');
    });

    it('returns 400 when priority is invalid', async () => {
      const res = await request(app).post('/api/tasks').send({ title: 't', priority: 'urgent' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/tasks', () => {
    it('returns an empty array initially', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('returns created tasks', async () => {
      await request(app).post('/api/tasks').send({ title: 'a' });
      await request(app).post('/api/tasks').send({ title: 'b' });
      const res = await request(app).get('/api/tasks');
      expect(res.body).toHaveLength(2);
    });

    it('rejects invalid query params', async () => {
      const res = await request(app).get('/api/tasks?sort=bogus');
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('returns 404 for missing task', async () => {
      const res = await request(app).get('/api/tasks/999');
      expect(res.status).toBe(404);
    });

    it('returns 400 for invalid id', async () => {
      const res = await request(app).get('/api/tasks/abc');
      expect(res.status).toBe(400);
    });
  });

  describe('PATCH /api/tasks/:id', () => {
    it('updates a task', async () => {
      const created = await request(app).post('/api/tasks').send({ title: 'old' });
      const res = await request(app)
        .patch(`/api/tasks/${created.body.id}`)
        .send({ title: 'new', completed: true });
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('new');
      expect(res.body.completed).toBe(true);
    });

    it('returns 404 for missing task', async () => {
      const res = await request(app).patch('/api/tasks/999').send({ title: 'x' });
      expect(res.status).toBe(404);
    });

    it('returns 400 for invalid body', async () => {
      const created = await request(app).post('/api/tasks').send({ title: 'old' });
      const res = await request(app)
        .patch(`/api/tasks/${created.body.id}`)
        .send({ completed: 'yes' });
      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('deletes a task', async () => {
      const created = await request(app).post('/api/tasks').send({ title: 'del' });
      const res = await request(app).delete(`/api/tasks/${created.body.id}`);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ id: created.body.id });

      const after = await request(app).delete(`/api/tasks/${created.body.id}`);
      expect(after.status).toBe(404);
    });

    it('returns 400 for invalid id', async () => {
      const res = await request(app).delete('/api/tasks/xyz');
      expect(res.status).toBe(400);
    });
  });
});
