import { Test, TestingModule } from '@nestjs/testing';
import { GameModel } from '../../src/models/game.model';
import { GameController } from './game.controller';
import { GameService } from './game.service';

describe('GameController', () => {
  let controller: GameController;

  beforeAll(async () => {
    const ApiServiceProvider = {
      provide: GameService,
      useFactory: () => ({
        create: jest.fn(() => ({})),
        findAll: jest.fn(() => []),
        findPublisher: jest.fn(() => ({})),
        findOne: jest.fn(() => ({})),
        update: jest.fn(() => ({})),
        remove: jest.fn(() => ({})),
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [GameService, ApiServiceProvider],
    }).compile();

    controller = module.get<GameController>(GameController);
  });

  describe('When calling create', () => {
    it('should return object', () => {
      expect(typeof controller.create(new GameModel())).toEqual('object');
    });
  });

  describe('When calling findAll', () => {
    it('should return object', () => {
      expect(typeof controller.findAll()).toEqual('object');
    });
  });

  describe('When calling findOne', () => {
    it('should return object', () => {
      expect(typeof controller.findOne('1')).toEqual('object');
    });
  });

  describe('When calling findPublisher', () => {
    it('should return object', () => {
      expect(typeof controller.findPublisher('1')).toEqual('object');
    });
  });

  describe('When calling update', () => {
    it('should return object', () => {
      expect(typeof controller.update('1', new GameModel())).toEqual('object');
    });
  });

  describe('When calling remove', () => {
    it('should return object', () => {
      expect(typeof controller.remove('1')).toEqual('object');
    });
  });
});
