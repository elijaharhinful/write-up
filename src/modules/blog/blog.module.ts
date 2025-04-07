import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: 
  [
    TypeOrmModule.forFeature([Blog]),
    UserModule,
],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [TypeOrmModule],
})
export class BlogModule {}
