const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

function rowToTask(row, tags = []) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    due_date: row.due_date,
    priority: row.priority,
    completed: !!row.completed,
    created_at: row.created_at,
    updated_at: row.updated_at,
    tags,
  };
}

function getTagsForTask(db, taskId) {
  return db
    .prepare(
      `SELECT t.name FROM tags t
       JOIN task_tags tt ON tt.tag_id = t.id
       WHERE tt.task_id = ?
       ORDER BY t.name`,
    )
    .all(taskId)
    .map((r) => r.name);
}

function ensureTags(db, names) {
  const insert = db.prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)');
  const select = db.prepare('SELECT id, name FROM tags WHERE name = ?');
  return names.map((name) => {
    const trimmed = name.trim();
    insert.run(trimmed);
    return select.get(trimmed);
  });
}

function setTaskTags(db, taskId, tagNames) {
  db.prepare('DELETE FROM task_tags WHERE task_id = ?').run(taskId);
  if (!tagNames || tagNames.length === 0) return;
  const tags = ensureTags(db, tagNames);
  const link = db.prepare('INSERT INTO task_tags (task_id, tag_id) VALUES (?, ?)');
  for (const tag of tags) link.run(taskId, tag.id);
}

function listTasks(db, filters = {}) {
  const where = [];
  const params = [];

  if (filters.status === 'active') where.push('tasks.completed = 0');
  if (filters.status === 'completed') where.push('tasks.completed = 1');

  if (filters.priority) {
    where.push('tasks.priority = ?');
    params.push(filters.priority);
  }

  if (filters.q) {
    where.push("(tasks.title LIKE ? OR IFNULL(tasks.description, '') LIKE ?)");
    const like = `%${filters.q}%`;
    params.push(like, like);
  }

  if (filters.tag) {
    where.push(`tasks.id IN (
      SELECT task_id FROM task_tags
      JOIN tags ON tags.id = task_tags.tag_id
      WHERE tags.name = ?
    )`);
    params.push(filters.tag);
  }

  if (filters.due === 'today') {
    where.push("date(tasks.due_date) = date('now')");
  } else if (filters.due === 'week') {
    where.push("date(tasks.due_date) BETWEEN date('now') AND date('now','+7 days')");
  } else if (filters.due === 'overdue') {
    where.push("date(tasks.due_date) < date('now') AND tasks.completed = 0");
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const rows = db.prepare(`SELECT * FROM tasks ${whereSql}`).all(...params);

  const sorted = sortTasks(rows, filters.sort);
  return sorted.map((row) => rowToTask(row, getTagsForTask(db, row.id)));
}

function sortTasks(rows, sort) {
  const byCompletion = (a, b) => Number(a.completed) - Number(b.completed);

  const comparators = {
    due: (a, b) => {
      const ad = a.due_date ? Date.parse(a.due_date) : Infinity;
      const bd = b.due_date ? Date.parse(b.due_date) : Infinity;
      return ad - bd;
    },
    priority: (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority],
    created: (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at),
    title: (a, b) => a.title.localeCompare(b.title),
  };

  const cmp = comparators[sort] || comparators.due;
  return [...rows].sort((a, b) => byCompletion(a, b) || cmp(a, b));
}

function getTask(db, id) {
  const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!row) return null;
  return rowToTask(row, getTagsForTask(db, id));
}

function createTask(db, data) {
  const insert = db.prepare(
    `INSERT INTO tasks (title, description, due_date, priority, completed)
     VALUES (?, ?, ?, ?, ?)`,
  );
  const result = insert.run(
    data.title.trim(),
    data.description ?? null,
    data.due_date ?? null,
    data.priority ?? 'medium',
    data.completed ? 1 : 0,
  );
  const id = result.lastInsertRowid;
  if (data.tags) setTaskTags(db, id, data.tags);
  return getTask(db, id);
}

function updateTask(db, id, data) {
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!existing) return null;

  const fields = [];
  const params = [];

  const setField = (column, value) => {
    fields.push(`${column} = ?`);
    params.push(value);
  };

  if (data.title != null) setField('title', data.title.trim());
  if (data.description !== undefined) setField('description', data.description ?? null);
  if (data.due_date !== undefined) setField('due_date', data.due_date || null);
  if (data.priority != null) setField('priority', data.priority);
  if (data.completed != null) setField('completed', data.completed ? 1 : 0);

  if (fields.length > 0) {
    fields.push("updated_at = datetime('now')");
    params.push(id);
    db.prepare(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`).run(...params);
  }

  if (data.tags !== undefined) setTaskTags(db, id, data.tags || []);

  return getTask(db, id);
}

function deleteTask(db, id) {
  const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  return result.changes > 0;
}

function listTags(db) {
  return db.prepare('SELECT id, name FROM tags ORDER BY name').all();
}

function createTag(db, name) {
  const trimmed = name.trim();
  db.prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)').run(trimmed);
  return db.prepare('SELECT id, name FROM tags WHERE name = ?').get(trimmed);
}

module.exports = {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  listTags,
  createTag,
};
