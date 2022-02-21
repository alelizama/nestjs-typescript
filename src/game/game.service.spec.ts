import { Test, TestingModule } from '@nestjs/testing';
import { PublisherModel } from 'src/models/publisher.model';
import { GameController } from './game.controller';
import { GameService } from './game.service';

const queryStub = jest.fn();

const GameModelSpy = {
  query: queryStub,
};
let game;

describe('GameService', () => {
  let service: GameService;

  beforeAll(async () => {
    game = {
      id: 2,
      title: 'the test game',
      price: 160,
      publisher: null,
      tags: ['tag1', 'tag2'],
      releaseDate: new Date().toString(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [
        GameService,
        {
          provide: 'GameModel',
          useValue: GameModelSpy,
        },
        {
          provide: 'PublisherModel',
          useValue: GameModelSpy,
        },
      ],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  describe('When response is successful', () => {
    describe('When findAll is called', () => {
      it('should call query() and return expected response', async () => {
        queryStub.mockReturnValue([game]);
        expect(await service.findAll()).toEqual([game]);
        expect(queryStub).toHaveBeenCalledTimes(2);
      });
    });

    describe('When create is called', () => {
      it('should call insert() and return expected response', async () => {
        const insertStub = jest.fn();
        queryStub.mockReturnValueOnce({ insert: insertStub });
        expect(await service.create(game)).toEqual({
          message: 'Game created',
        });
        expect(insertStub).toHaveBeenCalledWith(expect.objectContaining(game));
      });
    });

    describe('When findOne is called', () => {
      it('should call findById() and return expected response', async () => {
        const findByIdStub = jest.fn().mockReturnValue(game);
        queryStub.mockReturnValue({ findById: findByIdStub });
        expect(await service.findOne(1)).toEqual(game);
        expect(findByIdStub).toHaveBeenCalledWith(1);
      });

      describe('When game has a releaseDate between 12 and 18 months', () => {
        it('should apply discount', async () => {
          const discountDate = new Date();
          discountDate.setMonth(discountDate.getMonth() - 15);
          game.releaseDate = discountDate.toString();
          const findByIdStub = jest.fn().mockReturnValue(game);
          const updateAndFetchByIdStub = jest.fn();
          queryStub.mockReturnValue({
            findById: findByIdStub,
            updateAndFetchById: updateAndFetchByIdStub,
          });
          expect(await service.findOne(1)).toEqual(game);
          expect(findByIdStub).toHaveBeenCalledWith(1);
          expect(updateAndFetchByIdStub).toHaveBeenCalledWith(2, {
            discounted: true,
            price: 128,
          });
        });
      });

      describe('When game has a release date older than 18 months', () => {
        it('should be removed', async () => {
          const deleteByIdStub = jest.fn();
          const deletedDate = new Date();
          deletedDate.setMonth(deletedDate.getMonth() - 19);
          game.releaseDate = deletedDate.toString();
          const findByIdStub = jest.fn().mockReturnValue(game);
          queryStub.mockReturnValue({
            findById: findByIdStub,
            deleteById: deleteByIdStub,
          });
          expect(await service.findOne(1)).toEqual(game);
          expect(findByIdStub).toHaveBeenCalledWith(1);
          expect(deleteByIdStub).toHaveBeenCalledWith(game.id);
        });
      });
    });

    describe('When findPublisher is called', () => {
      it('should call findById() and return expected response', async () => {
        const findByIdStub = jest.fn().mockReturnValue(game);
        queryStub.mockReturnValue({ findById: findByIdStub });
        expect(await service.findPublisher(1)).toEqual(game);
        expect(findByIdStub).toHaveBeenCalledWith(1);
      });
    });

    describe('When update is called', () => {
      it('should call updateAndFetchById() and return expected response', async () => {
        const updateAndFetchByIdStub = jest.fn();
        queryStub.mockReturnValueOnce({
          updateAndFetchById: updateAndFetchByIdStub,
        });
        expect(await service.update(1, game)).toEqual({
          message: 'Game updated',
        });
        expect(updateAndFetchByIdStub).toHaveBeenCalledWith(
          1,
          expect.objectContaining(game),
        );
      });
    });

    describe('When remove is called', () => {
      it('should return expected response', async () => {
        const deleteByIdStub = jest.fn();
        queryStub.mockReturnValueOnce({
          deleteById: deleteByIdStub,
        });
        expect(await service.remove(1)).toEqual({
          message: 'Game removed',
        });
        expect(deleteByIdStub).toHaveBeenCalledWith(1);
      });
    });
  });

  describe('When response is not successful', () => {
    describe('When create is called', () => {
      it('should call insert() and return error response', async () => {
        const insertStub = jest.fn().mockRejectedValue('error');
        queryStub.mockReturnValueOnce({ insert: insertStub });
        try {
          await service.create({});
        } catch (error) {
          expect(error.message).toEqual('Incorrect data provided');
        }
        expect(insertStub).toHaveBeenCalledWith(expect.objectContaining({}));
      });
    });

    describe('When findOne is called', () => {
      describe('When no id is provided', () => {
        it('should call findById() and return error response', async () => {
          const findByIdStub = jest.fn().mockReturnValueOnce({ id: 1 });
          queryStub.mockReturnValueOnce({ findById: findByIdStub });
          try {
            await service.findOne(undefined);
          } catch (error) {
            expect(error.message).toEqual('Game does not exist');
          }
        });
      });

      describe('When game does not exist', () => {
        it('should call findById() and return error response', async () => {
          const findByIdStub = jest.fn().mockReturnValueOnce(undefined);
          queryStub.mockReturnValueOnce({ findById: findByIdStub });
          try {
            await service.findOne(undefined);
          } catch (error) {
            expect(error.message).toEqual('Game does not exist');
          }
        });
      });
    });

    describe('When findPublisher is called', () => {
      describe('When id is undefined', () => {
        it('should call findById() and return error response', async () => {
          const findByIdStub = jest.fn().mockReturnValue(game);
          queryStub.mockReturnValue({ findById: findByIdStub });
          try {
            await service.findPublisher(undefined);
          } catch (error) {
            expect(error.message).toEqual('Game does not exist');
          }
        });
      });

      describe('When game does not exists', () => {
        it('should call findById() and return error response', async () => {
          const findByIdStub = jest
            .fn()
            .mockReturnValueOnce(undefined)
            .mockReturnValueOnce(game);
          queryStub.mockReturnValue({ findById: findByIdStub });
          try {
            await service.findPublisher(1);
          } catch (error) {
            expect(error.message).toEqual('No Publisher for this game');
          }
        });
      });

      describe('When publisher does not exists', () => {
        it('should call findById() and return error response', async () => {
          const findByIdStub = jest
            .fn()
            .mockReturnValueOnce(game)
            .mockReturnValueOnce(undefined);
          queryStub.mockReturnValue({ findById: findByIdStub });
          try {
            await service.findPublisher(1);
          } catch (error) {
            expect(error.message).toEqual('No Publisher for this game');
          }
        });
      });
    });

    describe('When update is called', () => {
      it('should call updateAndFetchById() and return error response', async () => {
        const updateAndFetchByIdStub = jest.fn().mockRejectedValue('error');
        queryStub.mockReturnValueOnce({
          updateAndFetchById: updateAndFetchByIdStub,
        });
        try {
          await service.update(1, undefined);
        } catch (error) {
          expect(error.message).toEqual('Incorrect data provided');
        }
      });
    });
  });
});
