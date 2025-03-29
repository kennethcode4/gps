import { Module } from '@nestjs/common';
import { GpsController } from './gps.controller';
import { GpsService } from './gps.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { Gps, GpsSchema } from './schemas/gps.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Gps.name, schema: GpsSchema }]),
    ClientsModule.register([
      {
        name: 'BACKEND_MICROSERVICE_CLIENT',
        transport: Transport.TCP,
        options: {
          host: '0.0.0.0',
          port: 3001,
        },
      },
    ]),
  ],
  controllers: [GpsController],
  providers: [GpsService],
  exports: [GpsService],
})
export class GpsModule {}
