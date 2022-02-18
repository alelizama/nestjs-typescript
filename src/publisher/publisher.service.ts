import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from 'nest-knexjs';
import { Knex } from 'knex';
import { PublisherDto } from 'src/dto/publisher.dto';

@Injectable()
export class PublisherService {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async findAll() {
    const publisher = await this.knex.table('publisher');
    return { publisher };
  }

  async create(createPublisherDto: PublisherDto) {
    try {
      const publisher = await this.knex.table('publisher').insert({
        name: createPublisherDto.name,
        siret: createPublisherDto.siret,
        phone: createPublisherDto.phone,
      });

      return { publisher };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    if (!id) {
      throw new NotFoundException(`Publisher ${id} does not exist`);
    }
    const publisher = await this.knex.table('publisher').where('id', id);
    return { publisher };
  }

  async update(id: number, updatePublisherDto: PublisherDto) {
    try {
      const publisher = await this.knex
        .table('publisher')
        .where('id', id)
        .update({
          name: updatePublisherDto.name,
          siret: updatePublisherDto.siret,
          phone: updatePublisherDto.phone,
        });

      return { publisher };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    if (!id) {
      throw new NotFoundException(`Publisher ${id} does not exist`);
    }
    const publisher = await this.knex.table('publisher').where('id', id).del();
    return { publisher };
  }
}
