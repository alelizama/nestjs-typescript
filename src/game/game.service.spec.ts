import { Test, TestingModule } from '@nestjs/testing';
import { GameDto } from 'src/dto/game.dto';
import { GameController } from './game.controller';
import { GameService } from './game.service';

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
  update(id: number, dto: GameDto) {
    return { dto };
  }
  remove(id: number) {
    return { id };
  }
}

describe('GameService', () => {
  let service: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: GameService,
          useClass: ApiServiceMock,
        },
      ],
      controllers: [GameController],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  describe('When findAll is called', () => {
    it('should return expected response', async () => {
      expect(service.findAll()).toEqual([]);
    });
  });

  describe('When create is called', () => {
    it('should return expected response', async () => {
      expect(service.create(new GameDto())).toEqual({});
    });
  });

  describe('When findOne is called', () => {
    it('should return expected response', async () => {
      expect(service.findOne(1)).toEqual({ id: 1 });
    });
  });

  describe('When update is called', () => {
    it('should return expected response', async () => {
      expect(service.update(1, new GameDto())).toEqual({
        dto: {},
      });
    });
  });

  describe('When remove is called', () => {
    it('should return expected response', async () => {
      expect(service.remove(1)).toEqual({ id: 1 });
    });
  });
});
