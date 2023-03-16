import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserInterface } from './interface';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) { }
  @Get('self')
  getSelf(@GetUser() user: User) {
    console.log(user);
    return user;
  }

  @Patch('self')
  editUser(
    @GetUser('id') userId: number,
    @Body() payload: EditUserInterface,
  ) {
    return this.userService.editUser(userId, payload);
  }
}
