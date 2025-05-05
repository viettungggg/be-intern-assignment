import { Request, Response } from 'express';
import { AppDataSource }     from '../data-source';
import { Post }              from '../entities/Post';
import { Hashtag }           from '../entities/Hashtag';
import { parsePaging }       from '../utils/pagination';
import { In }                from 'typeorm';

export class PostController {
  private postRepo    = AppDataSource.getRepository(Post);
  private hashtagRepo = AppDataSource.getRepository(Hashtag);

  // CREATE body: { authorId, content, hashtags }
  async createPost(req: Request, res: Response) {
    try {
      const { authorId, content, hashtags } = req.body as {
        authorId: number;
        content:  string;
        hashtags: string[];
      };

      const tags = hashtags.map(t => t.toLowerCase().replace('#', ''));

      const existing = await this.hashtagRepo.find({
        where: { tag: In(tags) }
      });
      const existingNames = existing.map(h => h.tag);

      const newTags = tags
        .filter(t => !existingNames.includes(t))
        .map(t => this.hashtagRepo.create({ tag: t }));

      const post = this.postRepo.create({
        content,
        author:   { id: authorId },
        hashtags: [...existing, ...newTags]
      });

      await this.postRepo.save(post);
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: 'Error creating post', error });
    }
  }

  async listPosts(req: Request, res: Response) {
    const { limit, offset } = parsePaging(req);
    const [posts, total] = await this.postRepo.findAndCount({
      relations: ['author', 'likes', 'hashtags'],
      order:     { createdAt: 'DESC' },
      take:      limit,
      skip:      offset
    });
    res.json({ data: posts, paging: { limit, offset, total } });
  }

  async getPostById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const post = await this.postRepo.findOne({
      where:     { id },
      relations: ['author', 'likes', 'hashtags']
    });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  }

  // UPDATE
  async updatePost(req: Request, res: Response) {
    const id   = parseInt(req.params.id);
    let post   = await this.postRepo.findOne({
      where:     { id },
      relations: ['hashtags']
    });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    this.postRepo.merge(post, req.body);
    await this.postRepo.save(post);
    res.json(post);
  }

  // DELETE
  async deletePost(req: Request, res: Response) {
    const id     = parseInt(req.params.id);
    const result = await this.postRepo.delete(id);
    if (result.affected === 0)
      return res.status(404).json({ message: 'Post not found' });
    res.status(204).send();
  }

  async getFeed(req: Request, res: Response) {
    const userId = parseInt(req.query.userId as string);
    const { limit, offset } = parsePaging(req);

    const sub = AppDataSource.getRepository('Follow')
      .createQueryBuilder('f')
      .select('f.followeeId')
      .where('f.followerId = :uid', { uid: userId })
      .getQuery();

    const [posts, total] = await this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author',   'author')
      .leftJoinAndSelect('post.likes',    'likes')
      .leftJoinAndSelect('post.hashtags', 'hashtags')
      .where(`post.authorId IN ${sub}`)
      .orderBy('post.createdAt', 'DESC')
      .skip(offset).take(limit)
      .getManyAndCount();

    res.json({ data: posts, paging: { limit, offset, total } });
  }

  // /api/posts/hashtag/:tag
  async getByHashtag(req: Request, res: Response) {
    const tag = req.params.tag.toLowerCase().replace('#', '');
    const { limit, offset } = parsePaging(req);

    const [posts, total] = await this.postRepo
      .createQueryBuilder('post')
      .innerJoin('post.hashtags', 'h', 'h.tag = :tag', { tag })
      .leftJoinAndSelect('post.author',   'author')
      .leftJoinAndSelect('post.likes',    'likes')
      .orderBy('post.createdAt', 'DESC')
      .skip(offset).take(limit)
      .getManyAndCount();

    res.json({ data: posts, paging: { limit, offset, total } });
  }
}
