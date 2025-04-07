import { AbstractBaseEntity } from "../../../entities/base.entity";
import { Column, Entity, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Blog } from "../../blog/entities/blog.entity";

@Entity()
export class Comment extends AbstractBaseEntity {
    @Column({ nullable: false, type: 'text' })
    comment: string;

    @Column({ nullable: false, default: 0 })
    likes: number;

    @Column({ nullable: false, default: 0 })
    dislikes: number;

    @ManyToOne(() => Blog, blog => blog.comments)
    @JoinColumn({ name: 'blogId' })
    blog: Blog;

    @ManyToOne(() => Comment, comment => comment.replies)
    @JoinColumn({ name: 'parentId' })
    parent: Comment;

    @OneToMany(() => Comment, comment => comment.parent)
    replies: Comment[];
}