import { Controller, Get } from '@nestjs/common';
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

@Controller('/api/v1/microservice-b2')
export class GpsController {
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
    this.gpsService.saveGpsData(payload);
    this.gpsWsGateway.emitLocation(payload);
  }
}
