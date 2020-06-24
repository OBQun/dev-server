import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn } from "typeorm";
import { IsNotEmpty, MinLength } from "class-validator";
import { Article } from "app/entities";

@Entity('admin')
export class Admin {

    @PrimaryGeneratedColumn()
    id: number

    @IsNotEmpty({ message: '用户名不能为空' })
    @MinLength(4, { message: '用户名不得少于4位' })
    @Column()
    username: string

    @IsNotEmpty({ message: '密码不能为空' })
    @MinLength(6, { message: '密码不得少于6位' })
    @Column()
    password: string


    @Column()
    avatar: string

    @IsNotEmpty({ message: '名称不能为空' })
    @Column()
    name: string

    @OneToMany(type => Article, article => article.author)
    @JoinColumn()
    articles: Article[]

    @CreateDateColumn()
    create_time: Date

    @UpdateDateColumn()
    update_time: Date

}