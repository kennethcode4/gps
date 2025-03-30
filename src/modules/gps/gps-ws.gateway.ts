import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

import { GpsService } from './gps.service';
import { GpsDto } from './dto/gps-dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class GpsWsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly gpsService: GpsService) {}

  emitLocation(payload: GpsDto) {
    this.server.emit('gps-location-update', payload);
  }
}
