import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from 'nest-knexjs';
import { Knex } from 'knex';
import { GameDto } from 'src/dto/game.dto';

@Injectable()
export class GameService {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async update(id: number, updateGameDto: any) {
    try {
      const game = await this.knex.table('games').where('id', id).update({
        title: updateGameDto.title,
        price: updateGameDto.price,
        publisher: updateGameDto.publisher,
        tags: updateGameDto.tags,
        releaseDate: updateGameDto.releaseDate,
        discounted: updateGameDto.discounted,
      });

      return game;
    } catch (err) {
      throw new HttpException('Incorrect data', HttpStatus.BAD_REQUEST);
    }
  }

  monthDiff(releaseDate) {
    let months;
    const currentDate = new Date();
    months = (currentDate.getFullYear() - releaseDate.getFullYear()) * 12;
    months -= releaseDate.getMonth();
    months += currentDate.getMonth();
    return months <= 0 ? 0 : months;
  }

  async verifyReleaseDate(game: any[]) {
    return game.forEach((item) => {
      const gameObject = <GameDto>(<unknown>item);
      const month = this.monthDiff(gameObject.releaseDate);
      if (!gameObject.discounted && month > 11 && month < 19) {
        const newPrice = gameObject.price - gameObject.price * 0.2;
        return this.update(gameObject.id, {
          price: newPrice,
          discounted: true,
        });
      }
      if (month > 18) {
        return this.remove(gameObject.id);
      }
    });
  }

  async findAll() {
    const game = await this.knex.table('games');
    this.verifyReleaseDate(game);
    const gameVerified = await this.knex.table('games');
    return gameVerified;
  }

  async create(createGameDto: GameDto) {
    try {
      const game = await this.knex.table('games').insert({
        title: createGameDto.title,
        price: createGameDto.price,
        publisher: createGameDto.publisher,
        tags: createGameDto.tags,
        releaseDate: createGameDto.releaseDate,
      });

      return game;
    } catch (err) {
      throw new HttpException('Incorrect data', HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    if (!id) {
      throw new NotFoundException(`Game ${id} does not exist`);
    }
    const game = await this.knex.table('games').where('id', id);
    this.verifyReleaseDate(game);
    const gameVerified = await this.knex.table('games').where('id', id);
    return gameVerified;
  }

  async findPublisher(id: number) {
    if (!id) {
      throw new NotFoundException(`Game ${id} does not exist`);
    }

    const publisher = await this.knex
      .select('p.name', 'p.siret', 'p.phone')
      .from('publisher as p')
      .join('games as g', 'p.id', '=', 'g.publisher')
      .where('g.id', id);
    return publisher;
  }

  async remove(id: number) {
    if (!id) {
      throw new NotFoundException(`Game ${id} does not exist`);
    }
    await this.knex.table('games').where('id', id).del();
    return [];
  }
}
