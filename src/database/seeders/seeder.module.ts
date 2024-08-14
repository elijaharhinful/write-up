import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../modules/user/entities/user.entity';
import { SeederService } from './seeder.service';
import { SeederController } from './seeder.controller';
import { UserModule } from '../../modules/user/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([User]) , UserModule],
    providers: [SeederService],
    controllers: [SeederController],
})

export class SeederModule {}