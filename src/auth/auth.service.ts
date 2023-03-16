import { ForbiddenException, Injectable } from '@nestjs/common';
import { User, Todo } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { AuthInterface } from './interface';
import { Prisma } from '@prisma/client';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) { }
  async signup(payload: AuthInterface) {
    try {
      // password section
      const hash = await argon.hash(payload.password);
      payload['hash'] = hash;

      console.log({
        payload,
        hash,
      });
      // save to db
      const user = await this.prisma.user.create({
        data: {
          email: payload.email,
          hash,
        },
      })

      delete user.hash;

      // return the saved data

      return user;
    } catch (err) {
      console.log(err);
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new ForbiddenException('Email/credentials already taken.')
      }
      throw err;
    }
  }

  async login(payload: AuthInterface) {
    // find by email
    // throw error if no user
    const user = await this.prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    })
    if (!user) {
      throw new ForbiddenException('Incorrect user credentials');
    }
    // compare pass
    const passVerfication = await argon.verify(user.hash, payload.password);
    if (!passVerfication) {
      throw new ForbiddenException('Incorrect user credentials');
    }
    delete user.hash;
    // throw error if pass don't match

    // send user
    return user;
  }
}
