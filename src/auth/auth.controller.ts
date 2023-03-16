import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthInterface } from './interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('signup')
  signup(@Body() payload: AuthInterface) {
    return this.authService.signup(payload);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() payload: AuthInterface) {
    return this.authService.login(payload);
  }
}
