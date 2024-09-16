import { Controller, Post, Body, HttpStatus, Request, Patch, Param } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDTO } from './dto/create-blog.dto';
import { BlogResponseDTO } from './dto/blog-response-dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateBlogDTO } from './dto/update-blog.dto';

@ApiTags('Blogs')
@Controller('blogs')
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

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({summary: "Update Blog"})
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({type: UpdateBlogDTO})
  @ApiOkResponse({ description: 'Blog updated successfully!', type: BlogResponseDTO })
  @ApiBadRequestResponse({description: 'Bad Request.' })
  @ApiInternalServerErrorResponse({description: 'Internal server error'})
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDTO, @Request() req): Promise<BlogResponseDTO> {
    return this.blogService.updateBlog(updateBlogDto, req.user, id);
  }
}