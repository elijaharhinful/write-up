import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../modules/user/entities/user.entity";
import { Repository } from "typeorm";
import { CustomInternalServerErrorException } from "../../helpers/custom-exceptions";
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

    async seedUsers() {
        const count = await this.userRepository.count();
        if (count === 0) {
            const users = [
                {
                    firstName: 'Joe',
                    lastName: 'Dickson',
                    email: 'joe@example.com',
                    password: 'Password.123',
                },
                {
                    firstName: 'Jane',
                    lastName: 'Dickham',
                    email: 'jane@example.com',
                    password: 'Password.456',
                },
            ];

            for (const userData of users) {
                try {
                    const existingUser = await this.userRepository.findOne({ where: { email: userData.email } });
                    if (!existingUser) {
                        userData.password = await bcrypt.hash(userData.password,10);
                        const newUser = this.userRepository.create(userData);
                        await this.userRepository.save(newUser)
                        console.log(`User seeded: ${userData.email}`);
                    } else {
                        return `User already seeded: ${userData.email}`;
                    }
                } catch (error) {
                    throw new CustomInternalServerErrorException('Error while seeding database');
                }
            }
            return 'Database seeded successfully';
        } else {
            return 'Database already seeded';
        }
    }
}