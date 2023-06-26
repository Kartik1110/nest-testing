import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../src/users/users.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  const mockUsers = [{ id: 1, name: 'Kartik' }];

  const mockUsersRepository = {
    find: jest.fn().mockResolvedValue(mockUsers),
    create: jest.fn((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((user) =>
        Promise.resolve({ id: Date.now(), ...user }),
      ),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(mockUsersRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  /* GET request */
  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(mockUsers);
  });

  /* POST request */
  it('/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Kartik' })
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual({
          id: expect.any(Number),
          name: 'Kartik',
        });
      });
  });
});
