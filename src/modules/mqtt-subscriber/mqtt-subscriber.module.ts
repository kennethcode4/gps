import { Module } from '@nestjs/common';
import { MqttSubscriberController } from './mqtt-subscriber.controller';
import { MqttSubscriberService } from './mqtt-subscriber.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CONNECTION_MQTT } from 'src/helpers/constants';
import { MessageSerializer } from 'src/helpers/message-serializer';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: CONNECTION_MQTT.BROKER.CLIENT_ID,
        transport: Transport.MQTT,
        options: {
          url: `mqtt://${CONNECTION_MQTT.BROKER.HOST}:${CONNECTION_MQTT.BROKER.PORT}`,
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
