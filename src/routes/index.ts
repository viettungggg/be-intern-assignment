import { Router } from 'express';
import { userRouter }    from './user.routes';
import { postRouter }    from './post.routes';
import { hashtagRouter } from './hashtag.routes';
import { followRouter }  from './follow.routes';
import { likeRouter }    from './like.routes';
import { PostController } from '../controllers/post.controller';

const pc = new PostController();
const router = Router();

router.use('/users',    userRouter);
router.use('/posts',    postRouter);
router.use('/hashtags', hashtagRouter);
router.use('/follows',  followRouter);
router.use('/likes',    likeRouter);

// feed at /api/feed
router.get('/feed', pc.getFeed.bind(pc));

export default router;
