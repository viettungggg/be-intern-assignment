// src/routes/hashtag.routes.ts
import { Router } from 'express';
import { validate } from '../middleware/validation.middleware';
import { createHashtagSchema, updateHashtagSchema } from '../validations/hashtag.validation';
import { HashtagController } from '../controllers/hashtag.controller';

export const hashtagRouter = Router();
const hc = new HashtagController();

hashtagRouter.get('/',     hc.list.bind(hc));
hashtagRouter.get('/:id',  hc.getById.bind(hc));
hashtagRouter.post('/', validate(createHashtagSchema), hc.create.bind(hc));
hashtagRouter.put('/:id', validate(updateHashtagSchema), hc.update.bind(hc));
hashtagRouter.delete('/:id', hc.delete.bind(hc));
