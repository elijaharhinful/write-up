import { Controller, Post } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Seed')
@Controller('seeder')
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post('users')
  async seedUsers() {
    const result = await this.seederService.seedUsers();
    return {message: result};
  }
}
