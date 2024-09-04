import { Controller, Post, Body, HttpStatus, Request } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDTO } from './dto/create-blog.dto';
import { BlogResponseDTO } from './dto/blog-response-dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Blogs')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({summary: "Create Blog"})
  @ApiBody({type: CreateBlogDTO})
  @ApiCreatedResponse({ description: 'Blog created successfully!', type: BlogResponseDTO })
  @ApiBadRequestResponse({description: 'Bad Request.' })
  @ApiInternalServerErrorResponse({description: 'Internal server error'})
  create(@Body() createBlogDto: CreateBlogDTO, @Request() req): Promise<BlogResponseDTO> {
    return this.blogService.createBlog(createBlogDto, req.user);
  }
}