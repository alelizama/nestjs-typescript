import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class PublisherDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  siret: string;

  @IsNotEmpty()
  @IsString()
  phone: string;
}
