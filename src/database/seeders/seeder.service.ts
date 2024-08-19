import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../modules/user/entities/user.entity";
import { Repository } from "typeorm";
import { CustomInternalServerErrorException } from "../../helpers/custom-exceptions";
import * as bcrypt from 'bcrypt';
import { Profile } from "../../modules/profile/entities/profile.entity";
import { Blog } from "../../modules/blog/entities/blog.entity";
import { UserService } from "../../modules/user/user.service";

@Injectable()
export class SeederService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Profile) private profileRepository: Repository<Profile>,
        @InjectRepository(Blog) private blogRepository: Repository<Blog>,
        private readonly userService: UserService
    ) { }


    async seedUsers() {
        const count = await this.userRepository.count();
        if (count === 0) {
            const users = [
                {
                    firstName: 'Joe',
                    lastName: 'Dickson',
                    email: 'joe@example.com',
                    password: 'Password.123',
                    isSeeded: true,
                },
                {
                    firstName: 'Jane',
                    lastName: 'Dickham',
                    email: 'jane@example.com',
                    password: 'Password.456',
                    isSeeded: true,
                },
            ];

            const createdUsers = [];

            for (const userData of users) {
                try {
                    const existingUser = await this.userService.getUserByEmail(userData.email);
                    if (!existingUser) {
                        userData.password = await bcrypt.hash(userData.password, 10);
                        const newUser = this.userRepository.create(userData);
                        await this.userRepository.save(newUser)
                        const savedUser = await this.userRepository.save(newUser);

                        const { password, ...userWithoutPassword } = savedUser;
                        createdUsers.push(userWithoutPassword);
                    } else {
                        console.log(`User already seeded: ${userData.email}`);
                    }
                } catch (error) {
                    throw new CustomInternalServerErrorException('Error while seeding database');
                }
            }
            return createdUsers;
        } else {
            console.log('Users already seeded');
        }
    }

    async seedProfiles() {
        const count = await this.profileRepository.count();
        if (count === 0) {
            const users = await this.seedUsers();
            for (const user of users) {
                const profileData = {
                    gender: user.firstName === 'Joe' ? 'male' : 'female',
                    bio: `This is ${user.firstName}'s bio.`,
                    industry: 'Finance',
                    occupation: 'Financial analyst',
                    isSeeded: true,
                    user: user,
                };
                try {
                    const newProfile = this.profileRepository.create(profileData);
                    await this.profileRepository.save(newProfile);
                } catch (error) {
                    throw new CustomInternalServerErrorException('Error while seeding profile');
                }
            };
            return 'Profiles seeded successfully';
        }
        else {
            return 'Profiles already seeded';
        }
    }

    async seedBlogs() {
        const count = await this.blogRepository.count();
        if (count === 0) {
            const users = await this.seedUsers();
            for (const user of users) {
                const blogData = {
                    title: 'Blog Title',
                    content: '<p>This is a paragraph</p>',
                    tags: ['tag1', 'tag2','tag3'],
                    isSeeded: true,
                    user: user.id,
                }
                try {
                    const newBlog = this.blogRepository.create(blogData);
                    await this.blogRepository.save(newBlog);
                } catch(error){
                    throw new CustomInternalServerErrorException('Error while seeding blog')
                }
            };
            return 'Blogs seeded successfully';
        } else {
            return 'Blogs already seed'
        }
    }

    async seedDatabase() {
        try {
            await this.seedUsers();
            await this.seedProfiles();
            await this.seedBlogs();
            return 'Database seeded successfully';
        } catch (error) {
            throw new CustomInternalServerErrorException('Error while seeding database')
        }
    }

    async deleteSeedings() {
        try {
            const blogCount = await this.blogRepository.count();
            if (blogCount > 0) {
                await this.blogRepository.delete({ isSeeded: true });
            }

            const profileCount = await this.profileRepository.count();
            if (profileCount > 0) {
                await this.profileRepository.delete({ isSeeded: true });
                console.log('All profiles deleted successfully');
            }

            const userCount = await this.userRepository.count();
            if (userCount > 0) {
                await this.userRepository.delete({ isSeeded: true });
                console.log('All users deleted successfully');
            }

            return 'All seed data deleted successfully';
        } catch (error) {
            throw new CustomInternalServerErrorException('Error while deleting seed data');
        }
    }
}