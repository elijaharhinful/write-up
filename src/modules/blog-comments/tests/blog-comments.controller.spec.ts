import { Test, TestingModule } from '@nestjs/testing';
import { BlogCommentsController } from '../blog-comments.controller';
import { BlogCommentsService } from '../blog-comments.service';

describe('BlogCommentsController', () => {
  let controller: BlogCommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogCommentsController],
      providers: [BlogCommentsService],
    }).compile();

    controller = module.get<BlogCommentsController>(BlogCommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
