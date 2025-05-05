import { Request, Response } from 'express';
import { User } from '../entities/User';
import { Follow } from '../entities/Follow';
import { Like } from '../entities/Like';
import { Post } from '../entities/Post';
import { AppDataSource } from '../data-source';

export class UserController {
  private userRepository = AppDataSource.getRepository(User);
  private followRepository = AppDataSource.getRepository(Follow);
  private likeRepository   = AppDataSource.getRepository(Like);
  private postRepository   = AppDataSource.getRepository(Post);

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userRepository.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const user = await this.userRepository.findOneBy({
        id: parseInt(req.params.id),
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user', error });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const user = this.userRepository.create(req.body);
      const result = await this.userRepository.save(user);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const user = await this.userRepository.findOneBy({
        id: parseInt(req.params.id),
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      this.userRepository.merge(user, req.body);
      const result = await this.userRepository.save(user);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user', error });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const result = await this.userRepository.delete(parseInt(req.params.id));
      if (result.affected === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error });
    }
  }


  async getFollowers(req: Request, res: Response) {
    const limit  = Math.min(parseInt(req.query.limit as string)  || 20, 100);
    const offset = Math.max(parseInt(req.query.offset as string) || 0,  0);
    const userId = parseInt(req.params.id);

    try {
      const [rows, total] = await this.followRepository.findAndCount({
        where: { followeeId: userId },
        relations: ['follower'],
        order: { createdAt: 'DESC' },
        take: limit,
        skip: offset,
      });

      res.json({
        total,
        limit,
        offset,
        data: rows.map(r => ({
          id:        r.follower.id,
          firstName: r.follower.firstName,
          lastName:  r.follower.lastName,
          followedAt: r.createdAt,
        })),
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching followers', error });
    }
  }

  async getActivity(req: Request, res: Response) {
    const limit  = Math.min(parseInt(req.query.limit as string)  || 20, 100);
    const offset = Math.max(parseInt(req.query.offset as string) || 0,  0);
    const userId = parseInt(req.params.id);
    const type   = (req.query.type as string)?.toUpperCase();
    const from   = req.query.from ? new Date(req.query.from as string) : undefined;
    const to     = req.query.to   ? new Date(req.query.to   as string) : undefined;

    try {
      const posts = await this.postRepository.createQueryBuilder('p')
        .select(['p.id AS refId', `'POST'  AS type`, 'p.createdAt AS ts'])
        .where('p.authorId = :uid', { uid: userId })
        .andWhere(buildRange('p.createdAt', from, to))
        .getRawMany();

      const likes = await this.likeRepository.createQueryBuilder('l')
        .select(['l.postId AS refId', `'LIKE'  AS type`, 'l.createdAt AS ts'])
        .where('l.userId = :uid', { uid: userId })
        .andWhere(buildRange('l.createdAt', from, to))
        .getRawMany();

      const follows = await this.followRepository.createQueryBuilder('f')
        .select(['f.followeeId AS refId', `'FOLLOW' AS type`, 'f.createdAt AS ts'])
        .where('f.followerId = :uid', { uid: userId })
        .andWhere(buildRange('f.createdAt', from, to))
        .getRawMany();

      let merged = [...posts, ...likes, ...follows]
        .filter(a => !type || a.type === type)
        .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());

      const total = merged.length;
      merged = merged.slice(offset, offset + limit);

      res.json({ total, limit, offset, data: merged });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching activity', error });
    }
  }
}

function buildRange(column: string, from?: Date, to?: Date) {
  if (from && to) return `${column} BETWEEN :from AND :to`;
  if (from)       return `${column} >= :from`;
  if (to)         return `${column} <= :to`;
  return '1=1';
}
