import { Controller, Post } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiTags } from '@nestjs/swagger';
import { SkipAuth } from '../../modules/auth/decorators/skip-auth.decorator';

@ApiTags('Seed')
@Controller('seeder')
export class SeederController {
  constructor(private readonly seederService: SeederService) { }

  @SkipAuth()
  @Post('users')
  @ApiCreatedResponse({ description: "Database seeded successfully" })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async seedUsers() {
    const result = await this.seederService.seedUsers();
    return { message: result };
  }
}
