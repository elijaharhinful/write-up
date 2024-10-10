import { AbstractBaseEntity } from "../../../entities/base.entity";
import { Column, Entity, ManyToMany } from "typeorm";
import { Blog } from "../../blog/entities/blog.entity";

@Entity()
export class BlogCategory extends AbstractBaseEntity {
    @Column({ nullable: false })
    category: string;

    @ManyToMany(() => Blog, blog => blog.categories)
    blogs: Blog[];
}