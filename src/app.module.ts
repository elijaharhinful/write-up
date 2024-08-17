import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { SeederModule } from './database/seeders/seeder.module';
import { SeederService } from './database/seeders/seeder.service';
import { BlogModule } from './modules/blog/blog.module';
import { ProfileModule } from './modules/profile/profile.module';
import { BlogCategoriesModule } from './modules/blog-categories/blog-categories.module';
import { BlogCommentsModule } from './modules/blog-comments/blog-comments.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [configService.get('DB_ENTITIES')],
        migrations: [configService.get('DB_MIGRATIONS')],
        ssl: configService.get('DB_SSL') === 'true',
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    SeederModule,
    BlogModule,
    ProfileModule,
    BlogCategoriesModule,
    BlogCommentsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SeederService,
    { provide: 'CONFIG', useClass: ConfigService },
    { provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {
  constructor(private dataSource: DataSource) { }
}
