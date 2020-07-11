import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { IsNotEmpty } from 'class-validator'
import { Admin, Tag } from 'app/entities'

@Entity('article')
export class Article {
  @PrimaryGeneratedColumn()
  id: number

  @IsNotEmpty({ message: '标题不能为空' })
  @Column()
  title: string

  @Column()
  description: string

  @Column()
  cover: string

  @ManyToOne(type => Admin, admin => admin.articles)
  author: Admin

  @ManyToMany(type => Tag, tag => tag.articles)
  @JoinTable()
  tags: Tag[]

  @IsNotEmpty({ message: '内容不能为空' })
  @Column('longtext')
  body: string

  @Column()
  views: number

  @CreateDateColumn()
  createTime: Date

  @UpdateDateColumn()
  updateTime: Date
}
