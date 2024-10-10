import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { ApiBody, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @ApiOperation({ summary: 'Register users' })
  @ApiCreatedResponse({ description: 'Registration successful' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiBody({type: CreateUserDto})
  @Post('register')
  @HttpCode(201)
  async register(@Body() createUserDto: CreateUserDto){
    return this.authService.register(createUserDto)
  }


  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login users' })
  @ApiBody({type: LoginDTO})
  @ApiOkResponse({ description: 'User login successful' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('login')
  @HttpCode(200)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Forget password' })
  @ApiBody({type: ForgetPasswordDto})
  @ApiOkResponse({ description: 'Password reset link has been sent to your email' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('forget-password')
  @HttpCode(200)
  async forgetPassword(@Body('email') email: string){
    return this.authService.forgetPassword(email);
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Reset password' })
  @ApiBody({type: ResetPasswordDto})
  @ApiOkResponse({ description: 'Password reset successful' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto ){
    return this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
  }
}
