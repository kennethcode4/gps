import { Controller } from '@nestjs/common';
import { MqttSubscriberService } from './mqtt-subscriber.service';
import { Ctx, MessagePattern, MqttContext, Payload } from '@nestjs/microservices';
import { TOPICS } from 'src/helpers/constants';

@Controller()
export class MqttSubscriberController {

    constructor(private readonly mqttSubscriberService: MqttSubscriberService) {}

    @MessagePattern(`${TOPICS.CCG_IOT}/#`)
    listenTopics(@Ctx() context: MqttContext, @Payload() payload: any) {
        return this.mqttSubscriberService.getData(context, payload);
    }

}
