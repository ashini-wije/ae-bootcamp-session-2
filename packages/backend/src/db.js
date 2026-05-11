const Database = require('better-sqlite3');

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    due_date TEXT,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high')),
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS task_tags (
    task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, tag_id)
  );
`;

function createDatabase() {
  const db = new Database(':memory:');
  db.pragma('foreign_keys = ON');
  db.exec(SCHEMA);
  return db;
}

function seed(db) {
  const insertTask = db.prepare(
    `INSERT INTO tasks (title, description, due_date, priority, completed)
     VALUES (?, ?, ?, ?, ?)`,
  );
  const insertTag = db.prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)');
  const linkTag = db.prepare(
    `INSERT OR IGNORE INTO task_tags (task_id, tag_id)
     VALUES (?, (SELECT id FROM tags WHERE name = ?))`,
  );

  const today = new Date().toISOString().slice(0, 10);

  const sampleTasks = [
    {
      title: 'Welcome to your TODO app',
      description: 'Click the pencil icon to edit me, or the checkbox to complete me.',
      due_date: today,
      priority: 'medium',
      completed: 0,
      tags: ['getting-started'],
    },
    {
      title: 'Try filtering and sorting',
      description: 'Use the filter bar above the list.',
      due_date: null,
      priority: 'low',
      completed: 0,
      tags: ['getting-started'],
    },
  ];

  for (const t of sampleTasks) {
    const result = insertTask.run(t.title, t.description, t.due_date, t.priority, t.completed);
    for (const tag of t.tags) {
      insertTag.run(tag);
      linkTag.run(result.lastInsertRowid, tag);
    }
  }
}

module.exports = { createDatabase, seed };
