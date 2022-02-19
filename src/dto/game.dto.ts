import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsArray,
  IsBoolean,
} from 'class-validator';

export class GameDto {
  id: number;

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
