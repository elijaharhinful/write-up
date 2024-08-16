import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { SkipAuth } from './decorators/skip-auth.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({type: LoginDTO})
  async login(@Request() req) {
    console.log(req.user);
    return this.authService.login(req.user);
  }
}
