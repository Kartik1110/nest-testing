import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUserService = {
    /* mock create method from service */
    create: jest.fn((dto) => {
      return {
        id: Date.now(),
        ...dto,
      };
    }),
    /* mock update method from service */
    update: jest.fn((id, dto) => {
      return {
        id,
        ...dto,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  /* create user test */
  it('should create a user', () => {
    const dto = { name: 'Kartik' };
    expect(controller.create(dto)).toEqual({
      id: expect.any(Number),
      name: dto.name,
    });

    expect(mockUserService.create).toHaveBeenCalledWith(dto);
  });

  /* update user test */
  it('should update a user', () => {
    const dto = { name: 'Kartik' };
    expect(controller.update('1', dto)).toEqual({
      id: 1,
      ...dto,
    });

    expect(mockUserService.update).toHaveBeenCalled();
  });
});
