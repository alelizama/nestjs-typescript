import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  afterEach(async () => {
    await app.close();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('Publisher (e2e)', () => {
    it('/publisher (GET)', () => {
      return request(app.getHttpServer())
        .get('/publisher')
        .expect(200)
        .expect([
          { id: 1, name: 'the publisher', siret: 111, phone: '1234' },
          { id: 2, name: 'another one', siret: 222, phone: '5678' },
        ]);
    });

    it('/publisher (POST)', () => {
      return request(app.getHttpServer())
        .post('/publisher')
        .send({
          name: 'the publisher test',
          siret: 1,
          phone: '1234',
        })
        .expect(201)
        .expect({ message: 'Publisher created' });
    });

    it('/publisher/:id (GET)', () => {
      return request(app.getHttpServer())
        .get('/publisher/1')
        .expect(200)
        .expect({ id: 1, name: 'the publisher', siret: 111, phone: '1234' });
    });

    it('/publisher/:id (PUT)', () => {
      return request(app.getHttpServer())
        .put('/publisher/1')
        .send({ name: 'updated' })
        .expect(200)
        .expect({ message: 'Publisher updated' });
    });

    it('/publisher/:id (DELETE)', () => {
      return request(app.getHttpServer())
        .delete('/publisher/1')
        .expect(200)
        .expect({ message: 'Publisher removed' });
    });
  });

  describe('Game (e2e)', () => {
    it('/game (GET)', async () => {
      const gameRequest = await request(app.getHttpServer()).get('/game');
      expect(gameRequest.status).toBe(200);
      expect(gameRequest.body).toStrictEqual([
        {
          id: 1,
          title: 'the game',
          price: 111,
          publisher: null,
          tags: 'tag1,tag2',
          releaseDate: expect.any(String),
          discounted: 0,
        },
        {
          id: 2,
          title: 'the discount game',
          price: 160, // with discount
          publisher: null,
          tags: 'tag1,tag2',
          releaseDate: expect.any(String),
          discounted: 1,
        },
        // id:3 is deleted because his releaseDate is older than 18 months
      ]);
    });

    it('/game (POST)', () => {
      return request(app.getHttpServer())
        .post('/game')
        .send({
          title: 'the new one',
          price: 160,
          publisher: null,
          tags: 'tag1',
          releaseDate: '2022-02-21',
        })
        .expect(201)
        .expect({ message: 'Game created' });
    });

    it('/game/:id (GET)', async () => {
      const gameRequest = await request(app.getHttpServer()).get('/game/1');
      expect(gameRequest.status).toBe(200);
      expect(gameRequest.body).toStrictEqual({
        id: 1,
        title: 'the game',
        price: 111,
        publisher: null,
        tags: 'tag1,tag2',
        releaseDate: expect.any(String),
        discounted: 0,
      });
    });

    it('/game/:id/publisher (GET)', async () => {
      await request(app.getHttpServer()).post('/game').send({
        title: 'the new one',
        price: 160,
        publisher: null,
        tags: 'tag1',
        releaseDate: '2022-02-21',
      });
      await request(app.getHttpServer()).put('/game/4').send({
        publisher: 3,
      });
      return request(app.getHttpServer())
        .get('/game/4/publisher')
        .expect(200)
        .expect({ id: 3, name: 'the publisher test', siret: 1, phone: '1234' });
    });

    it('/game/:id (PUT)', () => {
      return request(app.getHttpServer())
        .put('/game/1')
        .send({ title: 'updated' })
        .expect(200)
        .expect({ message: 'Game updated' });
    });

    it('/game/:id (DELETE)', () => {
      return request(app.getHttpServer())
        .delete('/game/1')
        .expect(200)
        .expect({ message: 'Game removed' });
    });
  });

  describe('When response is not successful', () => {
    describe('Publisher (e2e)', () => {
      it('/publisher/:id (GET)', () => {
        return request(app.getHttpServer())
          .get('/publisher/50')
          .expect(404)
          .expect({
            statusCode: 404,
            message: 'Publisher does not exist',
            error: 'Not Found',
          });
      });

      it('/publisher (POST)', () => {
        return request(app.getHttpServer())
          .post('/publisher')
          .send({
            any: 'any',
          })
          .expect(400)
          .expect({ statusCode: 400, message: 'Incorrect data provided' });
      });

      describe('/publisher/:id (PUT)', () => {
        describe('When incorrect data is sent', () => {
          it('should return an error', () => {
            return request(app.getHttpServer())
              .put('/publisher/1')
              .send({ any: 'any' })
              .expect(400)
              .expect({ statusCode: 400, message: 'Incorrect data provided' });
          });
        });

        describe('When no id is sent', () => {
          it('should return an error', () => {
            return request(app.getHttpServer())
              .put('/publisher/undefined')
              .send({ any: 'any' })
              .expect(404)
              .expect({
                statusCode: 404,
                message: 'Publisher does not exist',
                error: 'Not Found',
              });
          });
        });
      });
    });

    describe('Game (e2e)', () => {
      it('/game/:id (GET)', () => {
        return request(app.getHttpServer()).get('/game/50').expect(404).expect({
          statusCode: 404,
          message: 'Game does not exist',
          error: 'Not Found',
        });
      });

      it('/game (POST)', () => {
        return request(app.getHttpServer())
          .post('/game')
          .send({
            any: 'any',
          })
          .expect(400)
          .expect({ statusCode: 400, message: 'Incorrect data provided' });
      });

      describe('/game/:id (PUT)', () => {
        describe('When incorrect data is sent', () => {
          it('should return an error', () => {
            return request(app.getHttpServer())
              .put('/game/1')
              .send({ any: 'any' })
              .expect(400)
              .expect({ statusCode: 400, message: 'Incorrect data provided' });
          });
        });

        describe('When no id is sent', () => {
          it('should return an error', () => {
            return request(app.getHttpServer())
              .put('/game/undefined')
              .send({ any: 'any' })
              .expect(404)
              .expect({
                statusCode: 404,
                message: 'Game does not exist',
                error: 'Not Found',
              });
          });
        });
      });

      describe('/game/:id/publisher (GET)', () => {
        describe('When game does not exist', () => {
          it('should return error', async () => {
            await request(app.getHttpServer()).post('/game').send({
              title: 'the newnew one',
              price: 160,
              publisher: 50,
              tags: 'tag1',
              releaseDate: '2022-02-21',
            });
            return request(app.getHttpServer())
              .get('/game/50/publisher')
              .expect(404)
              .expect({
                statusCode: 404,
                message: 'Game does not exist',
                error: 'Not Found',
              });
          });
        });

        describe('When publisher does not exist', () => {
          it('/game/:id/publisher (GET)', async () => {
            await request(app.getHttpServer()).post('/game').send({
              title: 'the new one',
              price: 160,
              publisher: 10,
              tags: 'tag1',
              releaseDate: '2022-02-21',
            });
            return request(app.getHttpServer())
              .get('/game/5/publisher')
              .expect(404)
              .expect({
                statusCode: 404,
                message: 'No Publisher for this game',
                error: 'Not Found',
              });
          });
        });
      });
    });
  });
});
