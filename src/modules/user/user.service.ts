import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor (@InjectRepository(User) private userRepository: Repository<User>) {}

  createUser(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  getAllUsers() {
    return `This action returns all user`;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({where:{email}});
    return user;
  }

  updateUser(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  removeUser(id: number) {
    return `This action removes a #${id} user`;
  }
}
