import { Module } from '@nestjs/common';
import { MqttSubscriberController } from './mqtt-subscriber.controller';
import { MqttSubscriberService } from './mqtt-subscriber.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MQTT } from 'src/helpers/constants';
import { MessageSerializer } from 'src/helpers/message-serializer';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MQTT.BROKER.CLIENT_ID,
        transport: Transport.MQTT,
        options: {
          url: `mqtt://${MQTT.BROKER.HOST}:${MQTT.BROKER.PORT}`,
          serializer: new MessageSerializer(),
        },
      },
    ]),
  ],
  controllers: [MqttSubscriberController],
  providers: [MqttSubscriberService],
  exports: [MqttSubscriberService],
})
export class MqttSubscriberModule {}
