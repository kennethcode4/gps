import { Body, Controller, Post } from '@nestjs/common';
import { MqttPublisherService } from './mqtt-publisher.service';
import { MqttDataDto } from './dto/mqtt-data-dto';
import { TOPICS } from 'src/helpers/constants';

@Controller('api/v1/mqtt-publisher')
export class MqttPublisherController {

    constructor(private readonly mqttPublisherService: MqttPublisherService) {}

    @Post('publish-topic')
    publishTopic(@Body() mqttDataDto: MqttDataDto) {
        return this.mqttPublisherService.publishTopic(`${TOPICS.CCG_IOT}/${mqttDataDto.topic}`, mqttDataDto.data);
    }

}
