// src/validations/hashtag.validation.ts
import Joi from 'joi';

export const createHashtagSchema = Joi.object({
  tag: Joi.string().required().pattern(/^[\w]+$/).messages({
    'string.empty': 'Tag is required',
    'string.pattern.base': 'Tag must be alphanumeric or underscore'
  })
});

export const updateHashtagSchema = Joi.object({
  tag: Joi.string().pattern(/^[\w]+$/)
}).min(1).messages({
  'object.min': 'At least one field must be provided'
});
