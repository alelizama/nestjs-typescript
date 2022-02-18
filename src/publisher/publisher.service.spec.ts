import { Test, TestingModule } from '@nestjs/testing';
import { PublisherDto } from 'src/dto/publisher.dto';
import { PublisherController } from './publisher.controller';
import { PublisherService } from './publisher.service';

jest.mock('knex', () => {
  const fn = () => {
    return {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      raw: jest.fn().mockReturnThis(),
      then: jest.fn(function (done) {
        done(null);
      }),
    };
  };
  return fn;
});

class ApiServiceMock {
  findAll() {
    return [];
  }
  create() {
    return {};
  }
  findOne(id: number) {
    return { id };
  }
  update(id: number, dto: PublisherDto) {
    return { dto };
  }
  remove(id: number) {
    return { id };
  }
}

describe('PublisherService', () => {
  let service: PublisherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PublisherService,
          useClass: ApiServiceMock,
        },
      ],
      controllers: [PublisherController],
    }).compile();

    service = module.get<PublisherService>(PublisherService);
  });

  describe('When create is called', () => {
    it('should be called with expected params', async () => {
      expect(service.findAll()).toEqual([]);
    });
  });

  describe('When create is called', () => {
    it('should be called with expected params', async () => {
      const publisher = new PublisherDto();
      expect(service.create(new PublisherDto())).toEqual({});
    });
  });

  describe('When findOne is called', () => {
    it('should be called with expected params', async () => {
      expect(service.findOne(1)).toEqual({ id: 1 });
    });
  });

  describe('When update is called', () => {
    it('should be called with expected params', async () => {
      expect(service.update(1, new PublisherDto())).toEqual({
        dto: {},
      });
    });
  });

  describe('When remove is called', () => {
    it('should be called with expected params', async () => {
      expect(service.remove(1)).toEqual({ id: 1 });
    });
  });
});
