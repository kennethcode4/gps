import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { PATTERNS } from './gps.constants';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';

import { GpsService } from './gps.service';
import { MQTT } from 'src/helpers/constants';
import { GpsDto } from './dto/gps-dto';
import { GpsWsGateway } from './gps-ws.gateway';

@Controller('/gps')
export class GpsController {
  private readonly logger = new Logger(GpsService.name);

  constructor(
    private readonly gpsService: GpsService,
    private readonly gpsWsGateway: GpsWsGateway,
  ) {}

  // Send message to Message Pattern B1
  @Get('send-message')
  sendMessage() {
    return this.gpsService.sendMessagePattern('Message from B2');
  }

  // Receive message from Message Pattern B1
  @MessagePattern(PATTERNS.MESSAGE.SEND_MESSAGE)
  receiveMessageFromMessagePatternB1(data: { message: string }) {
    console.info(
      '[MessagePattern] Message received from Message Pattern B1',
      data,
    );
    this.gpsService.sendEventPattern('Event emmited in B2');
    return true;
  }

  // Receive event from Event B1
  @EventPattern(PATTERNS.EVENTS.RECEIVE_MESSAGE)
  receiveEventFromEventB1(data: { message: string }) {
    console.info('[EventPattern] Event received from Event B1', data);
    return true;
  }

  // Listen to the topic ccg-iot/gps/+/location from MQTT Broker
  @EventPattern(MQTT.TOPICS.CCG_GPS)
  listenGpsData(@Ctx() context: MqttContext, @Payload() payload: GpsDto) {
    console.log(payload);
    if (!this.isValidGpsData(payload)) {
      this.logger.error('Invalid GPS data from MQTT', payload);
      return;
    }
    this.gpsService.saveGpsData(payload);
    this.gpsWsGateway.emitLocation(payload);
  }

  // Validate GPS data
  private isValidGpsData(data: GpsDto): boolean {
    if (data.lat < -90 || data.lat > 90) return false;
    if (data.lng < -180 || data.lng > 180) return false;
    return true;
  }

  @Get('/route-history/:thingId')
  async getLocationHistory(
    @Param('thingId') thingId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const locations = await this.gpsService.getLocationHistory(thingId, start, end);
    return locations.map(location => ({
      thingId: location.thingId,
      lat: location.lat,
      lng: location.lng,
      altitude: location.altitude,
      speed: location.speed,
      type: location.type,
      date: location.date,
      direction: location.direction
    }));
  }
}
