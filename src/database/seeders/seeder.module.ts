import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../modules/user/entities/user.entity';
import { SeederService } from './seeder.service';
import { SeederController } from './seeder.controller';
import { UserModule } from '../../modules/user/user.module';
import { Profile } from '../../modules/profile/entities/profile.entity';
import { Blog } from '../../modules/blog/entities/blog.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Profile, Blog]),
        UserModule,
    ],
    providers: [SeederService],
    controllers: [SeederController],
})

export class SeederModule { }