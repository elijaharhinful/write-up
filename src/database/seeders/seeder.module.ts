import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { SeederService } from './seeder.service';
import { SeederController } from './seeder.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [SeederService],
    controllers: [SeederController],
})

export class SeederModule {}