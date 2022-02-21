import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

import { BaseModel } from './base.model';

export class PublisherModel extends BaseModel {
  static tableName = 'publisher';

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  siret: number;

  @IsNotEmpty()
  @IsString()
  phone: string;
}
