import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CustomUnauthorizedException } from '../../helpers/custom-exceptions';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any){
    if(!user){
      throw new CustomUnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user.id, role: user.role};
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  // async register(userData: Partial<User>) {
  //   const { password, ...rest } = userData;
  //   const hashedPassword = await bcrypt.hash(password, 10);
  //   const newUser = this.userRepository.create({
  //     ...rest,
  //     password: hashedPassword,
  //   });
  //   await this.userRepository.save(newUser);
  //   const { password: _, ...result } = newUser;
  //   return result;
  // }
}
