import Joi from 'joi';

export const pagingSchema = Joi.object({
  limit:  Joi.number().integer().min(1).max(100).default(20),
  offset: Joi.number().integer().min(0).default(0)
});
