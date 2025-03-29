import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

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
  @IsNumber()
  altitude: number;

  @IsNotEmpty()
  @IsNumber()
  speed: number;

  @IsNotEmpty()
  @IsString()
  type: string;
}
