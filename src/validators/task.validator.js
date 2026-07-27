const Joi = require('joi');

const titleSchema = Joi.string().trim().min(1).max(255).required();

const createTaskSchema = Joi.object({
  title: titleSchema,
  description: Joi.string().allow('', null).optional(),
  completed: Joi.boolean().optional(),
}).unknown(false);

const updateTaskSchema = Joi.object({
  title: titleSchema,
  description: Joi.string().allow('', null).optional(),
  completed: Joi.boolean().optional(),
}).unknown(false);

const taskIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
}).unknown(false);

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
};
