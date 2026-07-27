const fs = require('fs');
const path = require('path');

const testDbPath = path.join(__dirname, '..', 'tmp', 'task-model-test.db');

process.env.DB_PATH = testDbPath;

const { initializeDatabase, getDatabase, closeDatabase } = require('../../src/config/database');
const taskModel = require('../../src/models/task.model');

function resetTasks() {
  const db = getDatabase();
  db.prepare('DELETE FROM tasks').run();
  db.prepare("DELETE FROM sqlite_sequence WHERE name = 'tasks'").run();
}

describe('task model', () => {
  beforeAll(() => {
    fs.mkdirSync(path.dirname(testDbPath), { recursive: true });
    initializeDatabase();
  });

  beforeEach(() => {
    resetTasks();
  });

  afterAll(() => {
    closeDatabase();
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  test('createTask creates and returns a task', () => {
    const task = taskModel.createTask({
      title: 'Write tests',
      description: 'Cover the task model',
      completed: false,
    });

    expect(task).toMatchObject({
      id: 1,
      title: 'Write tests',
      description: 'Cover the task model',
      completed: false,
    });
    expect(task.created_at).toBeDefined();
    expect(task.updated_at).toBeDefined();
  });

  test('getAllTasks returns tasks ordered by id descending', () => {
    const first = taskModel.createTask({ title: 'First task' });
    const second = taskModel.createTask({ title: 'Second task' });

    const tasks = taskModel.getAllTasks();

    expect(tasks).toHaveLength(2);
    expect(tasks[0].id).toBe(second.id);
    expect(tasks[1].id).toBe(first.id);
  });

  test('getTaskById returns one task and completed as a boolean', () => {
    const created = taskModel.createTask({
      title: 'Read task',
      description: '',
      completed: true,
    });

    const task = taskModel.getTaskById(created.id);

    expect(task.title).toBe('Read task');
    expect(task.completed).toBe(true);
    expect(typeof task.completed).toBe('boolean');
  });

  test('getTaskById returns null for a missing task', () => {
    expect(taskModel.getTaskById(999)).toBeNull();
  });

  test('updateTask updates and returns a task', () => {
    const created = taskModel.createTask({
      title: 'Old title',
      description: 'Old description',
      completed: false,
    });

    const updated = taskModel.updateTask(created.id, {
      title: 'New title',
      description: null,
      completed: true,
    });

    expect(updated).toMatchObject({
      id: created.id,
      title: 'New title',
      description: null,
      completed: true,
    });
  });

  test('updateTask returns null for a missing task', () => {
    const result = taskModel.updateTask(999, {
      title: 'Missing task',
      completed: true,
    });

    expect(result).toBeNull();
  });

  test('deleteTask removes a task', () => {
    const created = taskModel.createTask({ title: 'Delete task' });

    expect(taskModel.deleteTask(created.id)).toBe(true);
    expect(taskModel.getTaskById(created.id)).toBeNull();
  });

  test('deleteTask returns false for a missing task', () => {
    expect(taskModel.deleteTask(999)).toBe(false);
  });
});
