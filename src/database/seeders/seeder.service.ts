import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../modules/user/entities/user.entity";
import { DataSource, QueryRunner, Repository } from "typeorm";
import { CustomInternalServerErrorException } from "../../helpers/custom-exceptions";
import * as bcrypt from 'bcrypt';
import { Profile } from "../../modules/profile/entities/profile.entity";
import { Blog } from "../../modules/blog/entities/blog.entity";
import { UserService } from "../../modules/user/user.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

@Injectable()
export class SeederService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Profile) private profileRepository: Repository<Profile>,
        @InjectRepository(Blog) private blogRepository: Repository<Blog>,
        private readonly userService: UserService,
        private readonly dataSource: DataSource,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) { }


    async seedUsers(queryRunner: QueryRunner) {
        const count = await queryRunner.manager.getRepository(User).count();
        const createdUsers = [];
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
            for (const userData of users) {
                try {
                    const existingUser = await this.userService.getUserByEmail(userData.email);
                    if (!existingUser) {
                        userData.password = await bcrypt.hash(userData.password, 10);
                        const newUser = queryRunner.manager.getRepository(User).create(userData);
                        const savedUser = await queryRunner.manager.getRepository(User).save(newUser);
                        const { password, ...userWithoutPassword } = savedUser;
                        createdUsers.push(userWithoutPassword);
                    } else {
                        createdUsers.push(existingUser);
                    }
                } catch (error) {
                    this.logger.error(`Error seeding user: ${userData.email}`, error);
                    throw new CustomInternalServerErrorException('Error while seeding database');
                }
            }
        } else {
            if (createdUsers.length === 0) { 
                this.logger.info('Users already seeded');
            }
            const allUsers = await queryRunner.manager.getRepository(User).find();
            return allUsers.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
        }
        return createdUsers;
    }

    async seedProfiles(queryRunner: QueryRunner) {
        const count = await queryRunner.manager.getRepository(Profile).count();
        if (count === 0) {
            const users = await this.seedUsers(queryRunner);
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
                    const newProfile = queryRunner.manager.getRepository(Profile).create(profileData);
                    await queryRunner.manager.getRepository(Profile).save(newProfile);
                } catch (error) {
                    this.logger.error(`Error seeding profile: ${user.firstName}`, error);
                    throw new CustomInternalServerErrorException('Error while seeding profile');
                }
            };
            return 'Profiles seeded successfully';
        }
        else {
            return 'Profiles already seeded';
        }
    }

    async seedBlogs(queryRunner: QueryRunner) {
        const count = await queryRunner.manager.getRepository(Blog).count();
        if (count === 0) {
            const users = await this.seedUsers(queryRunner);
            for (const user of users) {
                const blogData = {
                    title: 'Blog Title',
                    content: '<p>This is a paragraph</p>',
                    tags: ['tag1', 'tag2', 'tag3'],
                    isSeeded: true,
                    user: user.id,
                }
                try {
                    const newBlog = queryRunner.manager.getRepository(Blog).create(blogData);
                    await queryRunner.manager.getRepository(Blog).save(newBlog);
                } catch (error) {
                    this.logger.error(`Error seeding blogs: ${blogData.title}`, error);
                    throw new CustomInternalServerErrorException('Error while seeding blogs')
                }
            };
            return 'Blogs seeded successfully';
        } else {
            return 'Blogs already seed'
        }
    }

    async seedDatabase() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            await queryRunner.startTransaction();

            await this.seedUsers(queryRunner);
            await this.seedProfiles(queryRunner);
            await this.seedBlogs(queryRunner);

            await queryRunner.commitTransaction();
            return 'Database seeded successfully';
        } catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Error while seeding database: ${error}`);
            throw new CustomInternalServerErrorException('Error while seeding database')
        } finally {
            await queryRunner.release();
        }
    }

    async deleteSeedings() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();

        try {
            await queryRunner.startTransaction();

            const blogCount = await queryRunner.manager.getRepository(Blog).count();
            if (blogCount > 0) {
                await queryRunner.manager.getRepository(Blog).delete({ isSeeded: true });
            }

            const userCount = await queryRunner.manager.getRepository(User).count();
            if (userCount > 0) {
                await queryRunner.manager.getRepository(User).delete({ isSeeded: true });
            }

            const profileCount = await queryRunner.manager.getRepository(Profile).count();
            if (profileCount > 0) {
                await queryRunner.manager.getRepository(Profile).delete({ isSeeded: true });
            }

            await queryRunner.commitTransaction();
            this.logger.info('All seed data deleted successfully');
            return 'All seed data deleted successfully';
        } catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error('Error while deleting seed data', error);
            throw new CustomInternalServerErrorException('Error while deleting seed data');
        } finally {
            await queryRunner.release();
        }
    }
}