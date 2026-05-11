const { createDatabase } = require('../src/db');
const service = require('../src/services/tasks');

describe('services/tasks', () => {
  let db;

  beforeEach(() => {
    db = createDatabase();
  });

  afterEach(() => {
    db.close();
  });

  it('creates and reads a task with tags', () => {
    const task = service.createTask(db, {
      title: 'Write docs',
      description: 'For the bootcamp',
      due_date: '2026-06-01',
      priority: 'high',
      tags: ['work', 'urgent'],
    });

    expect(task).toMatchObject({
      title: 'Write docs',
      description: 'For the bootcamp',
      due_date: '2026-06-01',
      priority: 'high',
      completed: false,
    });
    expect(task.tags.sort()).toEqual(['urgent', 'work']);
  });

  it('updates a task partially', () => {
    const created = service.createTask(db, { title: 'Original', priority: 'low' });
    const updated = service.updateTask(db, created.id, { title: 'Updated', completed: true });
    expect(updated.title).toBe('Updated');
    expect(updated.completed).toBe(true);
    expect(updated.priority).toBe('low');
  });

  it('replaces tags on update', () => {
    const created = service.createTask(db, { title: 'T', tags: ['a', 'b'] });
    const updated = service.updateTask(db, created.id, { tags: ['c'] });
    expect(updated.tags).toEqual(['c']);
  });

  it('returns null when updating a missing task', () => {
    expect(service.updateTask(db, 999, { title: 'x' })).toBeNull();
  });

  it('deletes a task', () => {
    const created = service.createTask(db, { title: 'Bye' });
    expect(service.deleteTask(db, created.id)).toBe(true);
    expect(service.getTask(db, created.id)).toBeNull();
  });

  describe('listTasks sorting and filtering', () => {
    beforeEach(() => {
      service.createTask(db, {
        title: 'A overdue',
        due_date: '2020-01-01',
        priority: 'low',
        tags: ['home'],
      });
      service.createTask(db, {
        title: 'B today',
        due_date: new Date().toISOString().slice(0, 10),
        priority: 'high',
        tags: ['work'],
      });
      service.createTask(db, {
        title: 'C no-date',
        priority: 'medium',
      });
      const done = service.createTask(db, { title: 'D done', priority: 'high' });
      service.updateTask(db, done.id, { completed: true });
    });

    it('sorts by due_date by default with completed last', () => {
      const tasks = service.listTasks(db);
      expect(tasks.map((t) => t.title)).toEqual(['A overdue', 'B today', 'C no-date', 'D done']);
    });

    it('filters by status=active', () => {
      const tasks = service.listTasks(db, { status: 'active' });
      expect(tasks.every((t) => !t.completed)).toBe(true);
      expect(tasks).toHaveLength(3);
    });

    it('filters by tag', () => {
      const tasks = service.listTasks(db, { tag: 'work' });
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('B today');
    });

    it('filters by due=overdue', () => {
      const tasks = service.listTasks(db, { due: 'overdue' });
      expect(tasks.map((t) => t.title)).toEqual(['A overdue']);
    });

    it('searches by q across title and description', () => {
      const tasks = service.listTasks(db, { q: 'no-date' });
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('C no-date');
    });

    it('sorts by priority', () => {
      const tasks = service.listTasks(db, { sort: 'priority', status: 'active' });
      expect(tasks[0].priority).toBe('high');
    });
  });
});
