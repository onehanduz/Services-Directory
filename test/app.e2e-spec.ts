import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto';

import { PrismaService } from '../src/prisma/prisma.service';
import { EditUserDto } from '../src/user/dto';
import { CreateCategoryDto } from 'src/category/dto';
import { CreateServicesDto, EditServicesDto } from 'src/services/dto';

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
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'user@gmail.com',
      password: '123',
    };
    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(201)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/user/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          first_name: 'User2',
          email: 'user2@gmail.com',
        };
        return pactum
          .spec()
          .patch('/user/edit')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.first_name)
          .expectBodyContains(dto.email);
      });
    });
  });

  describe('Category', () => {
    describe('Get category', () => {
      it('All Category', () => {
        return pactum
          .spec()
          .get('/category')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Create category', () => {
      it('Create', () => {
        const dto: CreateCategoryDto = {
          name: 'Test',
        };
        return pactum
          .spec()
          .post('/category')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .stores('categoryId', 'id')
          .expectStatus(201);
      });
    });

    describe('Edit category', () => {
      it('Edit', () => {
        const dto: CreateCategoryDto = {
          name: 'Test_Edited',
        };
        return pactum
          .spec()
          .patch('/category/$S{categoryId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200);
      });
    });

    describe('Get by ID', () => {
      it('Get by ID', () => {
        return pactum
          .spec()
          .get('/category/$S{categoryId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Delete by ID', () => {
      it('DElete by ID', () => {
        return pactum
          .spec()
          .delete('/category/$S{categoryId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Create category For Other', () => {
      it('Create', () => {
        const dto: CreateCategoryDto = {
          name: 'Test@@2',
        };
        return pactum
          .spec()
          .post('/category')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .stores('categoryId', 'id')
          .expectStatus(201);
      });
    });
  });

  describe('Services', () => {
    describe('Get All', () => {
      it('All Category', () => {
        return pactum
          .spec()
          .get('/services')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Create', () => {
      it('Create', () => {
        const dto = {
          name: 'Test',
          location: 'Amur Temur kochasi 2- uy',
          category_id: `$S{categoryId}`,
        };
        return pactum
          .spec()
          .post('/services')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .stores('serviceId', 'id')
          .expectStatus(201);
      });
    });

    describe('Edit', () => {
      it('Edit', () => {
        const dto: EditServicesDto = {
          name: 'Service_Edited',
        };
        return pactum
          .spec()
          .patch('/services/$S{serviceId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200);
      });
    });

    describe('Get by ID', () => {
      it('Get by ID', () => {
        return pactum
          .spec()
          .get('/services/$S{serviceId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Delete by ID', () => {
      it('DElete by ID', () => {
        return pactum
          .spec()
          .delete('/services/$S{serviceId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });
  });
});
