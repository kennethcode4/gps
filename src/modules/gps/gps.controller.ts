import { Controller, Get } from '@nestjs/common';
import { GpsService } from './gps.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { PATTERNS } from './gps.constants';

@Controller('/api/v1/microservice-b2')
export class GpsController {
  
  constructor(private readonly gpsService: GpsService) {}

  @Get('send-message')
  sendMessage() {
    return this.gpsService.sendMessagePattern('Message from B2');
  }

  @MessagePattern(PATTERNS.MESSAGE.SEND_MESSAGE)
  receiveMessageFromMessagePatternB1(data: { message: string }) {
    console.info('[MessagePattern] Message received from Message Pattern B1', data);
    this.gpsService.sendEventPattern('Event emmited in B2');
    return true;
  }

  @EventPattern(PATTERNS.EVENTS.RECEIVE_MESSAGE)
  receiveEventFromEventB1(data: { message: string }) {
    console.info('[EventPattern] Event received from Event B1', data);
    return true;
  }
}
