import { Module } from '@nestjs/common';
import { GpsModule } from './modules/gps/gps.module';
import { MqttSubscriberModule } from './modules/mqtt-subscriber/mqtt-subscriber.module';
import { MqttPublisherModule } from './modules/mqtt-publisher/mqtt-publisher.module';

@Module({
  imports: [GpsModule, MqttSubscriberModule, MqttPublisherModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
