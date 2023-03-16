import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthInterface } from './interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('signup')
  signup(@Body() payload: AuthInterface) {
    console.log({
      payload,
    });
    return this.authService.signup(payload);
  }

  @Post('login')
  login(@Body() payload: AuthInterface) {
    return this.authService.login(payload);
  }
}
