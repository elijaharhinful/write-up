import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CustomInternalServerErrorException, CustomNotFoundException, CustomUnauthorizedException } from '../../helpers/custom-exceptions';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { User } from '../user/entities/user.entity';
import { LoginResponseDto } from './dto/login-response-dto';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { GenericAuthResponseDto } from './dto/generic-auth-response.dto';
import { EmailsService } from '../emails/emails.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private emailService: EmailsService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) { }

  async validateUser(email: string, pass: string): Promise<Partial<User>> {
    const user = await this.userService.getUserByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(userData: Partial<User>): Promise<LoginResponseDto> {
    if (!userData) {
      throw new CustomUnauthorizedException('Invalid credentials');
    }
    try {
      const payload = { email: userData.email, sub: userData.id, role: userData.role };
      const { password: _, ...user } = userData;
      return {
        statusCode: HttpStatus.OK,
        message: 'User login successful',
        data: {
          user,
          access_token: await this.jwtService.signAsync(payload),
        },
      };
    } catch (error) {
      this.logger.error(error);
      throw new CustomInternalServerErrorException('Error during login');
    }

  }

  async register(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userService.getUserByEmail(createUserDto.email);
    if (existingUser) {
      throw new CustomUnauthorizedException('Email already in use. Try another email');
    }
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = await this.userService.createUser({
        ...createUserDto, password: hashedPassword,
      });
      const { password, ...userData } = user;
      return {
        statusCode: HttpStatus.CREATED,
        message: "Registration successful",
        data: userData,
      }
    } catch (error) {
      throw new CustomInternalServerErrorException('Error during user registration');
    }

  }

  async forgetPassword(email: string): Promise<GenericAuthResponseDto> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new CustomNotFoundException('User');
    }
    try {
      const resetToken = await this.jwtService.signAsync(
        { email: user.email, sub: user.id },
        { expiresIn: '1h' },
      );
      const resetLink = `${process.env.BASE_URL}/reset-password/${resetToken}`;
      await this.emailService.sendEmail(
        user.email,
        'Password Reset',
        'password-reset',
        { user, resetLink },
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Password reset link has been sent to your email',
        data: [],
      };
    } catch (error) {
      this.logger.error(error);
      throw new CustomInternalServerErrorException('Error during password reset request');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<GenericAuthResponseDto> {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.userService.getUserByEmail(decoded.email);
      if (!user) {
        throw new CustomNotFoundException('User')
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.userService.updateUserPassword(user.id, hashedPassword);
      return {
        statusCode: HttpStatus.OK,
        message: 'Password reset successful',
        data: [],
      };
    } catch (error) {
      this.logger.error(error);
      throw new CustomInternalServerErrorException('Error while reseting password');
    }
  }
}
