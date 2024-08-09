import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forRoot(), ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService, { provide: 'CONFIG', useClass: ConfigService }],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
