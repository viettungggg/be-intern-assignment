// src/routes/follow.routes.ts
import { Router } from 'express';
import { FollowController } from '../controllers/follow.controller';

export const followRouter = Router();
const fc = new FollowController();

followRouter.post('/:id/follow', fc.follow.bind(fc));
followRouter.delete('/:id/follow', fc.unfollow.bind(fc));
