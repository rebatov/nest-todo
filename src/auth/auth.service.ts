import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { User, Todo } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthInterface } from './interface';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private Jwt: JwtService,
    private config: ConfigService) { }
  async signup(payload: AuthInterface) {
    try {
      // password section
      const hash = await argon.hash(payload.password);
      payload['hash'] = hash;
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
    // throw error if pass don't match

    // send user
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ) {
    const payload = {
      sub: userId,
      email,
    }
    const accessToken = await this.Jwt.signAsync(payload, {
      expiresIn: '30m',
      secret: this.config.get('JWT_SECRET'),
    });
    return {
      access_token: accessToken,
    }
  }
}
