import { Module } from '@nestjs/common';
import { GpsController } from './gps.controller';
import { GpsService } from './gps.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { Gps, GpsSchema } from './schemas/gps.schema';
import { GpsWsGateway } from './gps-ws.gateway';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Gps.name, schema: GpsSchema }
    ]),
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
    CacheModule.register({
      ttl: 1000 * 60 * 60 * 24, // 1 dia
      max: 1000, // máximo 1000 items en caché
    }),
  ],
  controllers: [GpsController],
  providers: [GpsService, GpsWsGateway],
  exports: [GpsService],
})
export class GpsModule {}
