import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublisherModule } from './publisher/publisher.module';
import { GameModule } from './game/game.module';
import { DatabaseModule } from './database/database.module';
@Module({
  imports: [DatabaseModule, PublisherModule, GameModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
