// forklift-location.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
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
  @IsNotEmpty()
  lat: number;

  @Prop({ required: true })
  @IsNumber()
  @IsNotEmpty()
  lng: number;

  @Prop({ required: true, type: String, enum: Type, index: true })
  @IsEnum(Type)
  @IsNotEmpty()
  type: Type;

  @Prop()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  altitude: number;

  @Prop()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  speed: number;

  @Prop({ type: String, enum: Direction })
  @IsOptional()
  @IsEnum(Direction)
  @IsOptional()
  @IsEnum(Direction)
  direction: Direction;

  @Prop({ default: Date.now })
  @IsDateString()
  date: Date;

  @Prop({ type: String })
  @IsOptional()
  @IsString()
  alias: string;
}

export const GpsSchema = SchemaFactory.createForClass(Gps);
