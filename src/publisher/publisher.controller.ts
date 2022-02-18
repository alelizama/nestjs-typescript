import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { PublisherDto } from 'src/dto/publisher.dto';

@Controller('publisher')
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @Post()
  create(@Body() createPublisherDto: PublisherDto) {
    return this.publisherService.create(createPublisherDto);
  }

  @Get()
  findAll() {
    return this.publisherService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publisherService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePublisherDto: PublisherDto) {
    return this.publisherService.update(+id, updatePublisherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publisherService.remove(+id);
  }
}
