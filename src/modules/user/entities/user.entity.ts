import { AbstractBaseEntity } from "src/entities/base.entity";
import { Column, Entity } from "typeorm";

export enum UserRole {
    SUPER_ADMIN = 'super-admin',
    ADMIN = 'admin',
    USER = 'vendor',
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

    @Column({ nullable: false, default: UserRole.USER })
    role: UserRole;

    @Column({nullable: true})
    googleId: string

    @Column({nullable: true})
    googleProfilePicture: string

    @Column({nullable: true})
    googleToken: string
}
