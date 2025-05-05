import {
    Entity, PrimaryColumn, ManyToOne, CreateDateColumn, Index
  } from 'typeorm';
  import { User } from './User';
  
  @Entity('follows')
  @Index(['followerId', 'followeeId'], { unique: true })
  export class Follow {
    @PrimaryColumn() followerId: number;
    @PrimaryColumn() followeeId: number;
  
    @ManyToOne(() => User, u => u.following, { onDelete: 'CASCADE' })
    follower: User;
  
    @ManyToOne(() => User, u => u.followers, { onDelete: 'CASCADE' })
    followee: User;
  
    @CreateDateColumn() createdAt: Date;
  }
  