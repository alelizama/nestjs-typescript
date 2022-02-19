import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class PublisherDto {
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
