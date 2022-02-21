import { Test, TestingModule } from '@nestjs/testing';
import { PublisherController } from './publisher.controller';
import { PublisherService } from './publisher.service';

const queryStub = jest.fn();

const PublisherModelSpy = {
  query: queryStub,
};
const publisher = {
  id: 1,
  name: 'the test',
  siret: 123,
  phone: '1234',
};

describe('PublisherService', () => {
  let service: PublisherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublisherService,
        {
          provide: 'PublisherModel',
          useValue: PublisherModelSpy,
        },
      ],
      controllers: [PublisherController],
    }).compile();

    service = module.get<PublisherService>(PublisherService);
  });

  describe('When response is successful', () => {
    describe('When findAll is called', () => {
      it('should call query() and return expected response', async () => {
        queryStub.mockReturnValueOnce([{ id: 1 }]);
        expect(await service.findAll()).toEqual([{ id: 1 }]);
        expect(queryStub).toHaveBeenCalledTimes(1);
      });
    });

    describe('When create is called', () => {
      it('should call insert() and return expected response', async () => {
        const insertStub = jest.fn();
        queryStub.mockReturnValueOnce({ insert: insertStub });
        expect(await service.create(publisher)).toEqual({
          message: 'Publisher created',
        });
        expect(insertStub).toHaveBeenCalledWith(
          expect.objectContaining(publisher),
        );
      });
    });

    describe('When findOne is called', () => {
      it('should call findById() and return expected response', async () => {
        const findByIdStub = jest.fn().mockReturnValueOnce({ id: 1 });
        queryStub.mockReturnValueOnce({ findById: findByIdStub });
        expect(await service.findOne(1)).toEqual({ id: 1 });
        expect(findByIdStub).toHaveBeenCalledWith(1);
      });
    });

    describe('When update is called', () => {
      it('should call updateAndFetchById() and return expected response', async () => {
        const updateAndFetchByIdStub = jest.fn();
        queryStub.mockReturnValueOnce({
          updateAndFetchById: updateAndFetchByIdStub,
        });
        expect(await service.update(1, publisher)).toEqual({
          message: 'Publisher updated',
        });
        expect(updateAndFetchByIdStub).toHaveBeenCalledWith(
          1,
          expect.objectContaining(publisher),
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
          message: 'Publisher removed',
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
            expect(error.message).toEqual('Publisher does not exist');
          }
        });
      });

      describe('When publisher does not exist', () => {
        it('should call findById() and return error response', async () => {
          const findByIdStub = jest.fn().mockReturnValueOnce(undefined);
          queryStub.mockReturnValueOnce({ findById: findByIdStub });
          try {
            await service.findOne(undefined);
          } catch (error) {
            expect(error.message).toEqual('Publisher does not exist');
          }
        });
      });
    });

    describe('When update is called', () => {
      it('should call updateAndFetchById() and return error response', async () => {
        const updateAndFetchByIdStub = jest.fn();
        queryStub.mockReturnValueOnce({
          updateAndFetchById: updateAndFetchByIdStub,
        });
        try {
          await service.update(1, {});
        } catch (error) {
          expect(error.message).toEqual('Incorrect data provided');
        }
      });
    });
  });
});
