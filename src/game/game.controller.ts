import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { GameService } from './game.service';
import { GameModel } from '../../src/models/game.model';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  create(@Body() createGameModel: GameModel) {
    return this.gameService.create(createGameModel);
  }

  @Get()
  findAll() {
    return this.gameService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameService.findOne(+id);
  }

  @Get(':id/publisher')
  findPublisher(@Param('id') id: string) {
    return this.gameService.findPublisher(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateGameModel: GameModel) {
    return this.gameService.update(+id, updateGameModel);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameService.remove(+id);
  }
}
