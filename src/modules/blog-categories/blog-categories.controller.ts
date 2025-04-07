import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BlogCategoriesService } from './blog-categories.service';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';

@Controller('blog-categories')
export class BlogCategoriesController {
  constructor(private readonly blogCategoriesService: BlogCategoriesService) {}

  @Post()
  create(@Body() createBlogCategoryDto: CreateBlogCategoryDto) {
    return this.blogCategoriesService.create(createBlogCategoryDto);
  }

  @Get()
  findAll() {
    return this.blogCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogCategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogCategoryDto: UpdateBlogCategoryDto) {
    return this.blogCategoriesService.update(+id, updateBlogCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogCategoriesService.remove(+id);
  }
}
