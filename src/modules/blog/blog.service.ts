import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateBlogDTO } from './dto/create-blog.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog, BlogStatus } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { BlogResponseDTO } from './dto/blog-response-dto';
import { UserService } from '../user/user.service';
import { CustomInternalServerErrorException, CustomNotFoundException } from '../../helpers/custom-exceptions';
import { Logger } from 'winston';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog) private blogRepository: Repository<Blog>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private userService: UserService,
  ) { }

  async createBlog(createBlogDto: CreateBlogDTO, currentUser: any): Promise<BlogResponseDTO> {
    try {
      const user = await this.userService.getUserById(currentUser.sub);
      if (!user) {
        throw new CustomNotFoundException('User');
      }
      const blog = this.blogRepository.create({
        ...createBlogDto,
        user: user,
      });
      const savedBlog = await this.blogRepository.save(blog);
      const blogResponse: BlogResponseDTO = {
        statusCode: 201,
        message: 'Blog created successfully',
        data: {
          id: savedBlog.id,
          title: savedBlog.title,
          content: savedBlog.content,
          imageUrls: savedBlog.imageUrls,
          tags: savedBlog.tags,
          status: savedBlog.status,
          scheduledAt: savedBlog.scheduledAt,
          likes: savedBlog.likes,
          dislikes: savedBlog.dislikes,
          isSeeded: savedBlog.isSeeded,
          author: `${user.firstName} ${user.lastName}`,
          createdAt: savedBlog.createdAt,
          updatedAt: savedBlog.updatedAt,
        },
      };
      return blogResponse;
    } catch (error) {
      this.logger.error(`Error while creating blog: ${error.stack}`);
      throw new CustomInternalServerErrorException('Error while creating blog');
    }
  }
}
