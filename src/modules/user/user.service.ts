import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor (@InjectRepository(User) private userRepository: Repository<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async getAllUsers() {
    return `This action returns all user`;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({where:{email}});
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({where:{id}});
    return user;
  }

  updateUser(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async updateUserPassword(userId: string, hashedPassword: string){
    await this.userRepository.update(userId, {password: hashedPassword});
  }

  removeUser(id: string) {
    return `This action removes a #${id} user`;
  }
}
