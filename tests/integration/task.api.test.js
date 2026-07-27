const fs = require('fs');
const path = require('path');
const request = require('supertest');

const testDbPath = path.join(__dirname, '..', 'tmp', 'task-api-test.db');

process.env.DB_PATH = testDbPath;

const app = require('../../src/app');
const { initializeDatabase, getDatabase, closeDatabase } = require('../../src/config/database');

function resetTasks() {
  const db = getDatabase();
  db.prepare('DELETE FROM tasks').run();
  db.prepare("DELETE FROM sqlite_sequence WHERE name = 'tasks'").run();
}

describe('task api', () => {
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

  test('GET /api/health returns 200', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: 'TaskFlow API is running',
    });
  });

  test('POST /api/v1/tasks with valid data returns 201', async () => {
    const response = await request(app)
      .post('/api/v1/tasks')
      .send({
        title: 'Create task',
        description: '',
        completed: false,
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      id: 1,
      title: 'Create task',
      description: '',
      completed: false,
    });
  });

  test('POST /api/v1/tasks with missing title returns 400', async () => {
    const response = await request(app)
      .post('/api/v1/tasks')
      .send({ description: 'No title' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'title' }),
      ])
    );
  });

  test('GET /api/v1/tasks returns 200', async () => {
    await request(app).post('/api/v1/tasks').send({ title: 'List task' });

    const response = await request(app).get('/api/v1/tasks');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
  });

  test('GET /api/v1/tasks/:id returns 200', async () => {
    const created = await request(app)
      .post('/api/v1/tasks')
      .send({ title: 'Find task', completed: true });

    const response = await request(app).get(`/api/v1/tasks/${created.body.data.id}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({
      id: created.body.data.id,
      title: 'Find task',
      completed: true,
    });
  });

  test('invalid id returns 400', async () => {
    const response = await request(app).get('/api/v1/tasks/not-a-number');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('missing task returns 404', async () => {
    const response = await request(app).get('/api/v1/tasks/999');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      success: false,
      error: {
        message: 'Task not found',
      },
    });
  });

  test('PUT /api/v1/tasks/:id updates a task', async () => {
    const created = await request(app)
      .post('/api/v1/tasks')
      .send({ title: 'Before update', completed: false });

    const response = await request(app)
      .put(`/api/v1/tasks/${created.body.data.id}`)
      .send({
        title: 'After update',
        description: null,
        completed: true,
      });

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({
      id: created.body.data.id,
      title: 'After update',
      description: null,
      completed: true,
    });
  });

  test('DELETE /api/v1/tasks/:id removes a task and returns 204', async () => {
    const created = await request(app)
      .post('/api/v1/tasks')
      .send({ title: 'Delete task' });

    const response = await request(app).delete(`/api/v1/tasks/${created.body.data.id}`);
    const lookup = await request(app).get(`/api/v1/tasks/${created.body.data.id}`);

    expect(response.status).toBe(204);
    expect(response.text).toBe('');
    expect(lookup.status).toBe(404);
  });
});
