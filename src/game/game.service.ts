import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ModelClass } from 'objection';
import { PublisherModel } from '../../src/models/publisher.model';
import { GameModel } from '../../src/models/game.model';

@Injectable()
export class GameService {
  constructor(
    @Inject('GameModel') private modelClass: ModelClass<GameModel>,
    @Inject('PublisherModel')
    private modelPublisherClass: ModelClass<PublisherModel>,
  ) {}

  checkGameExists(game: any) {
    if (!game) {
      throw new NotFoundException('Game does not exist');
    }
  }

  async update(id: number, props: Partial<GameModel>) {
    this.checkGameExists(id);
    try {
      await this.modelClass.query().updateAndFetchById(id, props);
      return { message: 'Game updated' };
    } catch (err) {
      throw new HttpException(
        'Incorrect data provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  monthDiff(releaseDate: string) {
    let months;
    const currentDate = new Date();
    const date = new Date(releaseDate);
    months = (currentDate.getFullYear() - date.getFullYear()) * 12;
    months -= date.getMonth();
    months += currentDate.getMonth();
    return months <= 0 ? 0 : months;
  }

  async verifyReleaseDate(game: GameModel) {
    const month = this.monthDiff(game.releaseDate);
    if (!game.discounted && month > 11 && month < 19) {
      const newPrice = game.price - game.price * 0.2;
      return this.update(game.id, {
        price: newPrice,
        discounted: true,
      });
    }
    if (month > 18) {
      return this.remove(game.id);
    }
  }

  async findAll() {
    let game = await this.modelClass.query();
    game.forEach(async (item) => {
      await this.verifyReleaseDate(item);
    });
    game = await this.modelClass.query();
    return game;
  }

  async create(props: Partial<GameModel>) {
    try {
      await this.modelClass.query().insert(props);
      return { message: 'Game created' };
    } catch (err) {
      throw new HttpException(
        'Incorrect data provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: number) {
    this.checkGameExists(id);

    const game = await this.modelClass.query().findById(id);
    this.checkGameExists(game);

    await this.verifyReleaseDate(game);
    const gameVerified = await this.modelClass.query().findById(id);

    this.checkGameExists(gameVerified);
    return gameVerified;
  }

  async findPublisher(id: number) {
    this.checkGameExists(id);

    const game = await this.modelClass.query().findById(id);
    this.checkGameExists(game);
    const publisher = await this.modelPublisherClass
      .query()
      .findById(game.publisher);
    if (!publisher) {
      throw new NotFoundException(`No Publisher for this game`);
    }
    return publisher;
  }

  async remove(id: number) {
    this.checkGameExists(id);
    await this.modelClass.query().deleteById(id);
    return { message: 'Game removed' };
  }
}
