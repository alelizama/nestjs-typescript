import { Test, TestingModule } from '@nestjs/testing';
import { PublisherModel } from '../../src/models/publisher.model';
import { PublisherController } from './publisher.controller';
import { PublisherService } from './publisher.service';

describe('PublisherController', () => {
  let controller: PublisherController;

  beforeAll(async () => {
    const ApiServiceProvider = {
      provide: PublisherService,
      useFactory: () => ({
        create: jest.fn(() => ({})),
        findAll: jest.fn(() => []),
        findOne: jest.fn(() => ({})),
        update: jest.fn(() => ({})),
        remove: jest.fn(() => ({})),
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublisherController],
      providers: [PublisherService, ApiServiceProvider],
    }).compile();

    controller = module.get<PublisherController>(PublisherController);
  });

  describe('When calling create', () => {
    it('should return object', () => {
      expect(typeof controller.create(new PublisherModel())).toEqual('object');
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

  describe('When calling update', () => {
    it('should return object', () => {
      expect(typeof controller.update('1', new PublisherModel())).toEqual(
        'object',
      );
    });
  });

  describe('When calling remove', () => {
    it('should return object', () => {
      expect(typeof controller.remove('1')).toEqual('object');
    });
  });
});
