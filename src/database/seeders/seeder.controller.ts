import { Controller, Post, Delete } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { SkipAuth } from '../../modules/auth/decorators/skip-auth.decorator';
import { DataSource } from 'typeorm';
import { CustomInternalServerErrorException } from '../../helpers/custom-exceptions';

@ApiTags('Seeder')
@Controller('seeder')
export class SeederController {
  constructor(
    private readonly seederService: SeederService,
    private readonly dataSource: DataSource,
  ) {}

  private async executeWithTransaction(action: (queryRunner: any) => Promise<any>) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await action(queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  @SkipAuth()
  @Post('seed-database')
  @ApiOperation({ summary: 'Seed the entire database' })
  @ApiCreatedResponse({ description: 'Database seeded successfully' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async seedDatabase() {
    return this.executeWithTransaction(async () => {
      const message = await this.seederService.seedDatabase();
      return { message };
    });
  }

  @SkipAuth()
  @Post('seed-users')
  @ApiOperation({ summary: 'Seed users' })
  @ApiCreatedResponse({ description: 'Users seeded successfully' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async seedUsers() {
    return this.executeWithTransaction(async (queryRunner) => {
      const message = await this.seederService.seedUsers(queryRunner);
      return { message };
    });
  }

  @SkipAuth()
  @Post('seed-profiles')
  @ApiOperation({ summary: 'Seed profiles' })
  @ApiCreatedResponse({ description: 'Profiles seeded successfully' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async seedProfiles() {
    return this.executeWithTransaction(async (queryRunner) => {
      const message = await this.seederService.seedProfiles(queryRunner);
      return { message };
    });
  }

  @SkipAuth()
  @Post('seed-blogs')
  @ApiOperation({ summary: 'Seed blogs' })
  @ApiCreatedResponse({ description: 'Blogs seeded successfully' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async seedBlogs() {
    return this.executeWithTransaction(async (queryRunner) => {
      const message = await this.seederService.seedBlogs(queryRunner);
      return { message };
    });
  }

  @SkipAuth()
  @Delete('delete-seed-data')
  @ApiOperation({ summary: 'Delete all seed data' })
  @ApiCreatedResponse({ description: 'All seed data deleted successfully' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async deleteSeedData() {
    return this.executeWithTransaction(async () => {
      const message = await this.seederService.deleteSeedings();
      return { message };
    });
  }
}
