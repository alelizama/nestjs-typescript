import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { ModelClass } from 'objection';
import { PublisherModel } from '../../src/models/publisher.model';

@Injectable()
export class PublisherService {
  constructor(
    @Inject('PublisherModel') private modelClass: ModelClass<PublisherModel>,
  ) {}

  checkPublisherExists(game) {
    if (!game) {
      throw new NotFoundException('Publisher does not exist');
    }
  }

  async findAll() {
    return this.modelClass.query();
  }

  async create(props: Partial<PublisherModel>) {
    try {
      await this.modelClass.query().insert(props);
      return { message: 'Publisher created' };
    } catch (err) {
      throw new HttpException(
        'Incorrect data provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: number) {
    this.checkPublisherExists(id);
    const publisher = await this.modelClass.query().findById(id);
    this.checkPublisherExists(publisher);
    return publisher;
  }

  async update(id: number, props: Partial<PublisherModel>) {
    this.checkPublisherExists(id);
    try {
      await this.modelClass.query().updateAndFetchById(id, props);
      return { message: 'Publisher updated' };
    } catch (err) {
      throw new HttpException(
        'Incorrect data provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number) {
    this.checkPublisherExists(id);
    await this.modelClass.query().deleteById(id);
    return { message: 'Publisher removed' };
  }
}
