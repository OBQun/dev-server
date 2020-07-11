import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinColumn } from 'typeorm'
import { IsNotEmpty } from 'class-validator'
import { Article } from 'app/entities'

@Entity('tag')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number

  @IsNotEmpty({ message: '标签名不能为空' })
  @Column()
  name: string

  @ManyToMany(type => Article, article => article.tags)
  articles: Article[]
}
