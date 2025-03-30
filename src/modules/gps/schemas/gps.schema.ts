// forklift-location.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { Document } from 'mongoose';

export enum Direction {
  NORTH = 'N',
  SOUTH = 'S',
  EAST = 'E',
  WEST = 'W',
  NORTHEAST = 'NE',
  NORTHWEST = 'NW',
  SOUTHEAST = 'SE',
  SOUTHWEST = 'SW',
  EASTNORTH = 'EN',
  EASTSOUTH = 'ES',
  WESTNORTH = 'WN',
  WESTSOUTH = 'WS',
}

export enum Type {
  FORKLIFT = 'forklift',
  TRUCK = 'truck', 
  CAR = 'car',
  PERSON = 'person',
}

@Schema({ timestamps: false })
export class Gps extends Document {
  @Prop({ required: true, index: true })
  @IsString()
  @IsNotEmpty()
  thingId: string;

  @Prop({ required: true })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  lat: number;

  @Prop({ required: true })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  lng: number;

  @Prop({ required: true })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  altitude: number;

  @Prop({ required: true })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  speed: number;

  @Prop({ required: true, type: String, enum: Type })
  @IsEnum(Type)
  type: Type;

  @Prop({ type: String, enum: Direction })
  @IsEnum(Direction)
  @IsOptional()
  direction: Direction;

  @Prop({ required: true, default: Date.now })
  @IsDateString()
  date: Date;
}

export const GpsSchema = SchemaFactory.createForClass(Gps);
