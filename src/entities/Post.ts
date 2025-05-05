import {
    Entity, PrimaryGeneratedColumn, Column,
    ManyToOne, OneToMany, ManyToMany, JoinTable,
    CreateDateColumn
  } from 'typeorm';
  import { User }    from './User';
  import { Like }    from './Like';
  import { Hashtag } from './Hashtag';
  
  @Entity('posts')
  export class Post {
    @PrimaryGeneratedColumn('increment')
    id: number;
  
    @Column({ type: 'text' })
    content: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @ManyToOne(() => User, u => u.posts, { onDelete: 'CASCADE' })
    author: User;
  
    @OneToMany(() => Like, l => l.post)
    likes: Like[];
  
    @ManyToMany(() => Hashtag, h => h.posts, { cascade: true })
    @JoinTable({ name: 'post_hashtags' })
    hashtags: Hashtag[];
  }
  