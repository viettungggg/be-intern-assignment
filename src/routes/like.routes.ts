// src/routes/like.routes.ts
import { Router } from 'express';
import { LikeController } from '../controllers/like.controller';

export const likeRouter = Router();
const lc = new LikeController();

likeRouter.post('/:id/like', lc.like.bind(lc));
likeRouter.delete('/:id/like', lc.unlike.bind(lc));
