import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserInterface } from './interface';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {

  }
  async editUser(userId: number, payload: EditUserInterface) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...payload,
      }
    });
    console.log(user);

    delete user.hash;
    return user;
  }
}
