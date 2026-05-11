const request = require('supertest');

const { createApp } = require('../../src/app');
const { createDatabase } = require('../../src/db');

describe('Tags API', () => {
  let app;
  let db;

  beforeEach(() => {
    db = createDatabase();
    ({ app } = createApp({ db, log: false }));
  });

  afterEach(() => {
    db.close();
  });

  it('lists tags created via tasks', async () => {
    await request(app)
      .post('/api/tasks')
      .send({ title: 't', tags: ['home', 'work'] });
    const res = await request(app).get('/api/tags');
    expect(res.status).toBe(200);
    expect(res.body.map((t) => t.name).sort()).toEqual(['home', 'work']);
  });

  it('creates a tag directly', async () => {
    const res = await request(app).post('/api/tags').send({ name: 'errands' });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('errands');
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(app).post('/api/tags').send({});
    expect(res.status).toBe(400);
  });
});
