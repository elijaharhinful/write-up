import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CustomInternalServerErrorException, CustomUnauthorizedException } from '../../helpers/custom-exceptions';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    if (!user) {
      throw new CustomUnauthorizedException('Invalid credentials');
    }
    try {
      const payload = { email: user.email, sub: user.id, role: user.role };
      const { password: _, ...loggedInUser } = user;
      return {
        statusCode: HttpStatus.OK,
        message: 'User login successful',
        data: {
          loggedInUser,
          access_token: await this.jwtService.signAsync(payload),
        },
      };
    } catch (error) {
      this.logger.error(error);
      throw new CustomInternalServerErrorException('Error during login');
    }

  }

  async register(createUserDto: CreateUserDto): Promise<any> {
    const existingUser = await this.userService.getUserByEmail(createUserDto.email);
    if (existingUser) {
      throw new CustomUnauthorizedException('Email already in use. Try another email');
    }
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = await this.userService.createUser({
        ...createUserDto, password: hashedPassword,
      });
      const { password, ...result } = user;
      return {
        stausCode: HttpStatus.CREATED,
        message: "Registration successful",
        data: result,
      }
    } catch (error) {
      throw new CustomInternalServerErrorException('Error during user registration');
    }

  }
}
