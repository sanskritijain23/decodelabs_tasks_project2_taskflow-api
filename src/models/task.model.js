const { getDatabase } = require('../config/database');

function mapTask(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    completed: Boolean(row.completed),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function createTask(taskData) {
  const db = getDatabase();
  const completed = taskData.completed ? 1 : 0;

  const result = db
    .prepare('INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)')
    .run(taskData.title, taskData.description ?? null, completed);

  return getTaskById(result.lastInsertRowid);
}

function getAllTasks() {
  const db = getDatabase();
  const rows = db.prepare('SELECT * FROM tasks ORDER BY id DESC').all();

  return rows.map(mapTask);
}

function getTaskById(id) {
  const db = getDatabase();
  const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

  return mapTask(row);
}

function updateTask(id, taskData) {
  const existingTask = getTaskById(id);

  if (!existingTask) {
    return null;
  }

  const db = getDatabase();
  const completed = taskData.completed ? 1 : 0;

  db.prepare(`
    UPDATE tasks
    SET title = ?, description = ?, completed = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(taskData.title, taskData.description ?? null, completed, id);

  return getTaskById(id);
}

function deleteTask(id) {
  const db = getDatabase();
  const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);

  return result.changes > 0;
}

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
