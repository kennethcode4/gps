import { Module } from '@nestjs/common';
import { MqttPublisherService } from './mqtt-publisher.service';
import { MqttPublisherController } from './mqtt-publisher.controller';
import { MqttSubscriberModule } from '../mqtt-subscriber/mqtt-subscriber.module';

@Module({
  imports: [MqttSubscriberModule],
  providers: [MqttPublisherService],
  controllers: [MqttPublisherController]
})
export class MqttPublisherModule {}
