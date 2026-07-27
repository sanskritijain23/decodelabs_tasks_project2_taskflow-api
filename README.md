# TaskFlow API

TaskFlow API is a small REST API for managing tasks. It uses Express for routing, SQLite for storage, Joi for request validation, and Jest with Supertest for tests.

## Features

- Health check endpoint
- Create, read, update, and delete tasks
- Request validation for task payloads and route parameters
- Consistent JSON error responses
- Separate SQLite database path for test runs

## Technology Stack

- Node.js
- Express.js
- CommonJS
- better-sqlite3
- Joi
- Morgan
- Jest
- Supertest

## Folder Structure

```text
taskflow-api/
  server.js
  src/
    app.js
    config/
      database.js
    controllers/
      task.controller.js
    middleware/
      errorHandler.js
      validation.js
    models/
      task.model.js
    routes/
      task.routes.js
    validators/
      task.validator.js
  tests/
    integration/
      task.api.test.js
    unit/
      task.model.test.js
  database/
    .gitkeep
```

## Installation

```bash
npm install
```

## Environment Setup

Create a `.env` file from `.env.example` if you want to override the defaults.

```env
PORT=3000
NODE_ENV=development
DB_PATH=./database/tasks.db
```

## Run Commands

```bash
npm start
npm run dev
```

## Test Commands

```bash
npm test
npm run test:coverage
npm run lint
```

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | Check API status |
| GET | `/api/v1/tasks` | List all tasks |
| GET | `/api/v1/tasks/:id` | Get one task |
| POST | `/api/v1/tasks` | Create a task |
| PUT | `/api/v1/tasks/:id` | Update a task |
| DELETE | `/api/v1/tasks/:id` | Delete a task |

## Request Examples

Create a task:

```json
{
  "title": "Finish API tests",
  "description": "Cover task endpoints",
  "completed": false
}
```

Update a task:

```json
{
  "title": "Finish API tests",
  "description": null,
  "completed": true
}
```

## Success Response Examples

Task response:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Finish API tests",
    "description": null,
    "completed": true,
    "created_at": "2026-07-27 10:00:00",
    "updated_at": "2026-07-27 10:05:00"
  }
}
```

List response:

```json
{
  "success": true,
  "data": []
}
```

Delete success returns HTTP 204 with no response body.

## Error Response Example

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "details": [
      {
        "field": "title",
        "message": "\"title\" is required"
      }
    ]
  }
}
```

## Current Limitations

- Tasks are stored in a local SQLite database.
- There is no authentication or user ownership.
- PUT updates the main task fields in one request.

## Future Improvements

- Add pagination for task lists.
- Add filtering by completion status.
- Add created date and updated date filters.
- Add user accounts if the project needs multi-user support.

## Author

Your Name
