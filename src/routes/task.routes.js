const express = require('express');
const taskController = require('../controllers/task.controller');
const validate = require('../middleware/validation');
const {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
} = require('../validators/task.validator');

const router = express.Router();

router.get('/', taskController.getAllTasks);
router.get('/:id', validate(taskIdSchema, 'params'), taskController.getTaskById);
router.post('/', validate(createTaskSchema), taskController.createTask);
router.put(
  '/:id',
  validate(taskIdSchema, 'params'),
  validate(updateTaskSchema),
  taskController.updateTask
);
router.delete('/:id', validate(taskIdSchema, 'params'), taskController.deleteTask);

module.exports = router;
