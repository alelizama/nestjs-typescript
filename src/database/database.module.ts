import { Model } from 'objection';
import { Knex, knex } from 'knex';
import { GameModel } from '../models/game.model';
import { PublisherModel } from '../models/publisher.model';
import { Global, Module } from '@nestjs/common';

const models = [GameModel, PublisherModel];

const modelProviders = models.map((model) => {
  return {
    provide: model.name,
    useValue: model,
  };
});

const providers = [
  ...modelProviders,
  {
    provide: 'KnexConnection',
    useFactory: async () => {
      const config: Knex.Config = {
        client: 'mysql',
        version: '5.7',
        useNullAsDefault: true,
        connection: {
          host: process.env.MYSQL_HOST || '127.0.0.1',
          user: 'root',
          password: 'root',
          database: 'nestjs-typescript',
        },
      };

      const knexInstance = knex(config);
      Model.knex(knexInstance);
      return knex;
    },
  },
];

@Global()
@Module({
  providers: [...providers],
  exports: [...providers],
})
export class DatabaseModule {}
