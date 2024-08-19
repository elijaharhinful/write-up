import { AbstractBaseEntity } from "../../../entities/base.entity";
import { Column, Entity, OneToOne } from "typeorm";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Profile extends AbstractBaseEntity {
    @Column({ nullable: true })
    gender: string;

    @Column({ nullable: true, type: 'varchar' })
    bio: string;

    @Column({ nullable: true })
    industry: string;

    @Column({ nullable: true })
    occupation: string;

    @Column({ nullable: true, default: 0 })
    followers: number;

    @Column({nullable: true})
    isSeeded: boolean;

    @OneToOne(() => User, user => user.profile)
    user: User;
}