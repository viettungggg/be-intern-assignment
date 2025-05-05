import { Request, Response } from 'express';
import { AppDataSource }     from '../data-source';
import { Like }             from '../entities/Like';

export class LikeController {
  private repo = AppDataSource.getRepository(Like);

  // POST /api/posts/:id/like   body: { userId }
  async like(req: Request, res: Response) {
    try {
      const postId = parseInt(req.params.id);
      const { userId } = req.body as { userId: number };
      const l = this.repo.create({ userId, postId });
      await this.repo.save(l);
      res.status(201).json(l);
    } catch (error) {
      res.status(500).json({ message: 'Error liking post', error });
    }
  }

  // DELETE /api/posts/:id/like  body: { userId }
  async unlike(req: Request, res: Response) {
    try {
      const postId = parseInt(req.params.id);
      const { userId } = req.body as { userId: number };
      await this.repo.delete({ userId, postId });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error unliking post', error });
    }
  }
}
