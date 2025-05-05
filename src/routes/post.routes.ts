// src/routes/post.routes.ts
import { Router } from 'express';
import { validate } from '../middleware/validation.middleware';
import { createPostSchema, updatePostSchema } from '../validations/posts.validation';
import { PostController } from '../controllers/post.controller';


export const postRouter = Router();
const pc = new PostController();

postRouter.get('/',    pc.listPosts.bind(pc));
postRouter.get('/:id', pc.getPostById.bind(pc));
postRouter.post('/', validate(createPostSchema), pc.createPost.bind(pc));
postRouter.put('/:id', validate(updatePostSchema), pc.updatePost.bind(pc));
postRouter.delete('/:id', pc.deletePost.bind(pc));
postRouter.get('/hashtag/:tag', pc.getByHashtag.bind(pc));

