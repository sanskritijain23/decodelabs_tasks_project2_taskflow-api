# Architecture

TaskFlow API uses a small MVC-style structure. The app keeps routing, validation, request handling, and database access in separate files without adding services or repositories.

```text
Client
  |
  v
server.js
  |
  v
src/app.js
  |
  v
src/routes/
  |
  v
src/middleware/
  |
  v
src/controllers/
  |
  v
src/models/
  |
  v
src/config/
```

## Entry Point

`server.js` loads environment variables, initializes SQLite, imports the Express app, and starts the HTTP server.

## Application Setup

`src/app.js` creates the Express app, registers Morgan and JSON body parsing, keeps the `/api/health` endpoint, mounts task routes at `/api/v1/tasks`, adds the JSON 404 handler, and registers the global error handler last.

## Routes

`src/routes/task.routes.js` defines the task URLs and connects each route to validation middleware and controller functions.

## Validation

`src/validators/task.validator.js` defines Joi schemas for task payloads and task ids.

`src/middleware/validation.js` validates `req.body` or `req.params`, stores the validated value back on the request, and forwards validation errors with status code 400.

## Controllers

`src/controllers/task.controller.js` handles request and response logic. Controllers call the model functions and pass errors to the global error handler.

## Models

`src/models/task.model.js` contains the SQLite queries for tasks. It uses `better-sqlite3`, parameterized SQL, and returns task records with `completed` converted to a JavaScript boolean.

## Database

`src/config/database.js` creates the SQLite database connection and initializes the `tasks` table if it does not exist.

The database path comes from `DB_PATH` and defaults to:

```text
./database/tasks.db
```

## Error Handling

`src/middleware/errorHandler.js` sends a consistent JSON response:

```json
{
  "success": false,
  "error": {
    "message": "Error message"
  }
}
```

Validation errors also include a `details` array.

## Testing

Unit tests cover the task model. Integration tests cover the Express API with Supertest.

Tests use separate SQLite database files under `tests/tmp/` and remove them after the test suites finish.
