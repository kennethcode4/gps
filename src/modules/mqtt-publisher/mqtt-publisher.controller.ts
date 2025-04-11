import { Body, Controller, Post } from '@nestjs/common';
import { MqttPublisherService } from './mqtt-publisher.service';
import { MqttDataDto } from './dto/mqtt-data-dto';
import { MQTT } from 'src/helpers/constants';

@Controller('/mqtt-publisher')
export class MqttPublisherController {

    constructor(private readonly mqttPublisherService: MqttPublisherService) {}

    @Post('publish-topic')
    publishTopic(@Body() mqttDataDto: MqttDataDto) {
        return this.mqttPublisherService.publishTopic(`${MQTT.TOPICS.CCG_IOT}/${mqttDataDto.topic}`, mqttDataDto.data);
    }

}
