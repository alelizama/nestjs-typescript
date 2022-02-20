import { Module } from '@nestjs/common';
import { KnexModule } from 'nest-knexjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublisherModule } from './publisher/publisher.module';
import { GameModule } from './game/game.module';
@Module({
  imports: [
    KnexModule.forRoot({
      config: {
        client: 'mysql',
        version: '5.7',
        useNullAsDefault: true,
        connection: {
          host: process.env.MYSQL_HOST || '127.0.0.1',
          user: 'root',
          password: 'root',
          database: 'nestjs-typescript',
        },
      },
    }),
    PublisherModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
