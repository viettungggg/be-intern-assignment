import express from 'express';
import dotenv from 'dotenv';
import { userRouter } from './routes/user.routes';
import { postRouter } from './routes/post.routes';
import { hashtagRouter } from './routes/hashtag.routes';
import { followRouter } from './routes/follow.routes';
import { likeRouter } from './routes/like.routes';
import { PostController } from './controllers/post.controller';
import { AppDataSource } from './data-source';

dotenv.config();

const app = express();
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

app.get('/', (req, res) => {
  res.send('Welcome to the Social Media Platform API! Server is running successfully.');
});

// existing
app.use('/api/users', userRouter);

// posts CRUD + hashtag search
app.use('/api/posts', postRouter);

// hashtags CRUD
app.use('/api/hashtags', hashtagRouter);

// follow/unfollow under users
app.use('/api/users', followRouter);

// like/unlike under posts
app.use('/api/posts', likeRouter);

// feed endpoint
const postController = new PostController();
app.get('/api/feed', postController.getFeed.bind(postController));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
