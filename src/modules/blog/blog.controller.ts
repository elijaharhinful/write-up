import { Controller, Post, Body, HttpStatus, Request, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDTO } from './dto/create-blog.dto';
import { BlogResponseDTO } from './dto/blog-response-dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  async createBlog(@Body() createBlogDto: CreateBlogDTO, @Request() req): Promise<BlogResponseDTO> {
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
  async updateBlog(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDTO, @Request() req): Promise<BlogResponseDTO> {
    return this.blogService.updateBlog(updateBlogDto, req.user, id);
  }

 @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({summary: "Delete Blog"})
  @ApiParam({name:'id', type: 'string'})
  @ApiQuery({ name: 'confirmed', type: 'boolean', required: false })
  @ApiOkResponse({description: 'Blog deleted successfully!'})
  @ApiBadRequestResponse({description: 'Bad Request'})
  @ApiInternalServerErrorResponse({description: 'Internal server error'})
  async deleteBlog(@Param('id') id:string, @Query('confirmed') confirmed: boolean, @Request() req){
    return this.blogService.deleteBlog(req.user, id, confirmed);
  } 
}