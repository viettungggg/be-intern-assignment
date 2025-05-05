import Joi from 'joi';

export const createPostSchema = Joi.object({
  content: Joi.string().required().max(280).messages({
    'string.empty':  'Post content is required',
    'string.max':    'Post cannot exceed 280 characters'
  }),
  hashtags: Joi.array()
    .items(Joi.string().pattern(/^#[\w]+$/i).messages({
      'string.pattern.base': 'Hashtags must start with # and contain letters, numbers, or _'
    }))
    .default([])
});

export const updatePostSchema = Joi.object({
  content:  Joi.string().max(280),
  hashtags: Joi.array()
              .items(Joi.string().pattern(/^#[\w]+$/i))
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});
