import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, Index } from 'typeorm';
import { Post } from './Post';

@Entity('hashtags')
export class Hashtag {
  @PrimaryGeneratedColumn('increment') id: number;

  @Column({ type: 'varchar', length: 64 })
  @Index({ unique: true })
  tag: string;

  @ManyToMany(() => Post, p => p.hashtags)
  posts: Post[];
}
