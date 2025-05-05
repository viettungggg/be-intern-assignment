import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';

import { Post } from './Post';
import { Follow } from './Follow';
import { Like } from './Like';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment') id: number;

  @Column({ type: 'varchar', length: 255 }) firstName: string;
  @Column({ type: 'varchar', length: 255 }) lastName:  string;

  @Column({ type: 'varchar', length: 255, unique: true }) email: string;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;

  /** relations */
  @OneToMany(() => Post,   p => p.author)    posts: Post[];
  @OneToMany(() => Follow, f => f.follower)  following: Follow[];
  @OneToMany(() => Follow, f => f.followee)  followers: Follow[];
  @OneToMany(() => Like,   l => l.user)      likes: Like[];
}
