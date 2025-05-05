import { Request, Response } from 'express';
import { AppDataSource }     from '../data-source';
import { Follow }           from '../entities/Follow';

export class FollowController {
  private repo = AppDataSource.getRepository(Follow);

  // POST /api/users/:id/follow   body: { followerId }
  async follow(req: Request, res: Response) {
    try {
      const followeeId = parseInt(req.params.id);
      const { followerId } = req.body as { followerId: number };
      const f = this.repo.create({ followerId, followeeId });
      await this.repo.save(f);
      res.status(201).json(f);
    } catch (error) {
      res.status(500).json({ message: 'Error following user', error });
    }
  }

  // DELETE /api/users/:id/follow  body: { followerId }
  async unfollow(req: Request, res: Response) {
    try {
      const followeeId = parseInt(req.params.id);
      const { followerId } = req.body as { followerId: number };
      await this.repo.delete({ followerId, followeeId });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error unfollowing user', error });
    }
  }
}
