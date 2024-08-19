import { AbstractBaseEntity } from "../../../entities/base.entity";
import { Column, Entity, ManyToOne, OneToMany, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Comment } from "../../blog-comments/entities/blog-comment.entity";
import { BlogCategory } from "../../blog-categories/entities/blog-category.entity";

export enum BlogStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    SCHEDULED = 'scheduled'
}

@Entity()
export class Blog extends AbstractBaseEntity {
    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false, type: 'text' })
    content: string;

    @Column({ type: 'simple-array', nullable: true })
    imageUrls: string[];

    @Column({ type: 'simple-array', nullable: true })
    tags: string[];

    @Column({ nullable: false, type: 'enum', enum: BlogStatus, default: BlogStatus.DRAFT })
    status: BlogStatus;

    @Column({ nullable: true, type: 'timestamp' })
    scheduledAt: Date;

    @Column({ nullable: false, default: 0 })
    likes: number;

    @Column({ nullable: false, default: 0 })
    dislikes: number;

    @Column({nullable: true})
    isSeeded: boolean;

    @ManyToOne(() => User, user => user.blogs)
    @JoinColumn({ name: 'userId' })
    user: User;

    @OneToMany(() => Comment, comment => comment.blog)
    comments: Comment[];

    @ManyToMany(() => BlogCategory)
    @JoinTable({
        name: 'blogCategoryMapping',
        joinColumn: { name: 'blogId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' }
    })
    categories: BlogCategory[];
}