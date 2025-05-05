import { Entity, PrimaryColumn, ManyToOne, CreateDateColumn, Index } from 'typeorm';
import { User } from './User';
import { Post } from './Post';

@Entity('likes')
@Index(['userId', 'postId'], { unique: true })
export class Like {
  @PrimaryColumn() userId: number;
  @PrimaryColumn() postId: number;

  @ManyToOne(() => User, u => u.likes, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Post, p => p.likes, { onDelete: 'CASCADE' })
  post: Post;

  @CreateDateColumn() createdAt: Date;
}
