import { ValidationPipe, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import { AuthInterface } from '../src/auth/interface';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3030);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3030');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const payload: AuthInterface = {
      email: 'jane.doe@gmail.com',
      password: 'worldhello',
      address: 'Antarctica',
    };
    describe('Signup', () => {
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(payload)
          .expectStatus(201)
      });
    });
    describe('Login', () => {
      it('should login', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(payload)
          .expectStatus(200)
      });
    });
  });
  describe('User', () => {
    describe('Get self', () => { });
    describe('Edit self', () => { });
  });
  describe('Todo', () => {
    describe('Create todo', () => { });
    describe('Get todo', () => { });
    describe('Get todo by id', () => { });
    describe('Edit todo', () => { });
    describe('Delete todo', () => { });
  });
});