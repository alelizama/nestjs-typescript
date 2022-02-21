import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsArray,
  IsBoolean,
} from 'class-validator';

import { BaseModel } from './base.model';

export class GameModel extends BaseModel {
  static tableName = 'games';

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  publisher: number;

  @IsNotEmpty()
  @IsArray()
  tags: string[];

  @IsNotEmpty()
  @IsString()
  releaseDate: string;

  @IsNotEmpty()
  @IsBoolean()
  discounted: boolean;
}
