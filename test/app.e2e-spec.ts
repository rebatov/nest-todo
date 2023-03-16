import { ValidationPipe, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import { AuthInterface } from '../src/auth/interface';
import { EditUserInterface } from '../src/user/interface';
import { CreateTodoInterface, EditTodoInterface } from '../src/todo/interface';

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
      it('should throw empty email error', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: payload.password,
          })
          .expectStatus(400)
      });
      it('should throw empty password error', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: payload.email,
          })
          .expectStatus(400)
      });
      it('should throw no body error', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400)
      });
      it('should throw credentials already taken error', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(payload)
          .expectStatus(403)
      });
    });

    describe('Login', () => {
      it('should login', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(payload)
          .expectStatus(200)
          .stores('userAccessToken', 'access_token')
      });
      it('should throw empty email error', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            password: payload.password,
          })
          .expectStatus(400)
      });
      it('should throw empty password error', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: payload.email,
          })
          .expectStatus(400)
      });
      it('should throw no body error', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .expectStatus(400)
      });
    });

  });
  describe('User', () => {
    describe('Get self', () => {
      it('should get self user', () => {
        return pactum
          .spec()
          .get('/users/self')
          .withHeaders('Authorization', `Bearer $S{userAccessToken}`)
          .expectStatus(200)
      });
    });
    describe('Edit self user', () => {
      it('should edit the user', () => {
        const payload: EditUserInterface = {
          firstName: 'Jane',
          lastName: 'Doe'
        };
        return pactum
          .spec()
          .patch('/users/self')
          .withBody(payload)
          .withHeaders('Authorization', `Bearer $S{userAccessToken}`)
          .expectStatus(200)
          .expectBodyContains(payload.firstName)
          .expectBodyContains(payload.lastName)
      });
    })
  });
  describe('Todo', () => {
    describe('Get empty todo', () => {
      it('should return empty todos', () => {
        return pactum
          .spec()
          .get('/todos')
          .withHeaders('Authorization', `Bearer $S{userAccessToken}`)
          .expectStatus(200)
          .expectBody([])
      })
    });
    describe('Create todo', () => {
      const payload: CreateTodoInterface = {
        title: 'First todo',
        description: 'Very first todo'
      };
      it('should create todo', () => {
        return pactum
          .spec()
          .post('/todos')
          .withBody(payload)
          .withHeaders('Authorization', `Bearer $S{userAccessToken}`)
          .expectStatus(201)
          .stores('todoId', 'id');
      })
    });
    describe('Get todo', () => {
      it('should return todos', () => {
        return pactum
          .spec()
          .get('/todos')
          .withHeaders('Authorization', `Bearer $S{userAccessToken}`)
          .expectStatus(200)
          .expectJsonLength(1);
      })
    });
    describe('Get todo by id', () => {
      it('should get todo by id', () => {
        return pactum
          .spec()
          .get('/todos/{id}')
          .withPathParams('id', `$S{todoId}`)
          .withHeaders('Authorization', `Bearer $S{userAccessToken}`)
          .expectStatus(200)
          .expectBodyContains(`$S{todoId}`)
      })
    });
    describe('Edit todo by id', () => {
      const payload: EditTodoInterface = {
        title: 'My edited todo',
        description: 'My edited description',
      }
      it('should get todo by id', () => {
        return pactum
          .spec()
          .patch('/todos/{id}')
          .withPathParams('id', `$S{todoId}`)
          .withHeaders('Authorization', `Bearer $S{userAccessToken}`)
          .withBody(payload)
          .expectStatus(200)
          .expectBodyContains(payload.title)
          .expectBodyContains(payload.description)
      })
    });
    describe('Delete todo by id', () => {
      it('should delete todo', () => {
        return pactum
          .spec()
          .delete('/todos/{id}')
          .withPathParams('id', `$S{todoId}`)
          .withHeaders('Authorization', `Bearer $S{userAccessToken}`)
          .expectStatus(204)
          .inspect()
      });

      it('should return empty todos', () => {
        return pactum
          .spec()
          .get('/todos')
          .withHeaders('Authorization', `Bearer $S{userAccessToken}`)
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});