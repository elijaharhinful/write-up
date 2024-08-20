import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { ApiBody, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { CreateUserDto } from '../user/dto/create-user.dto';

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
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
