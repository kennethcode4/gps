import { IsString, IsNumber, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class GpsDto {
  @IsNotEmpty()
  @IsString()
  thingId: string;

  @IsNotEmpty()
  @IsNumber()
  lat: number;

  @IsNotEmpty()
  @IsNumber()
  lng: number;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsOptional()
  @IsNumber()
  altitude: number;

  @IsOptional()
  @IsNumber()
  speed: number;

  @IsOptional()
  @IsString()
  direction: string;

  @IsOptional()
  @IsDateString()
  date?: Date;

  @IsOptional()
  @IsString()
  alias?: string;
}
