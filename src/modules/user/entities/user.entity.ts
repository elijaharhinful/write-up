import { AbstractBaseEntity } from "../../../entities/base.entity";
import { Column, Entity, OneToOne, OneToMany, JoinColumn } from "typeorm";
import { Profile } from "../../profile/entities/profile.entity";
import { Blog } from "../../blog/entities/blog.entity";

export enum UserRole {
    SUPER_ADMIN = 'super-admin',
    ADMIN = 'admin',
    USER = 'user',
}

@Entity()
export class User extends AbstractBaseEntity {
    @Column({ nullable: false })
    firstName: string;

    @Column({ nullable: false })
    lastName: string;

    @Column({ nullable: false, unique: true })
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: false, default: true })
    isActive: boolean;

    @Column({ nullable: false, type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Column({ nullable: true, unique: true })
    googleId: string;

    @Column({ nullable: true })
    googleProfilePicture: string;

    @Column({ nullable: true })
    googleToken: string;

    @Column({ nullable: true })
    isSeeded: boolean;

    @OneToOne(() => Profile, { cascade: true, nullable: true })
    @JoinColumn({ name: 'profileId' })
    profile: Profile;

    @OneToMany(() => Blog, blog => blog.user)
    blogs: Blog[];
}