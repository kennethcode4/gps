import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, MqttContext } from '@nestjs/microservices';
import { CONNECTION_MQTT, TOPICS } from 'src/helpers/constants';

@Injectable()
export class MqttSubscriberService {
  constructor(
    @Inject(CONNECTION_MQTT.BROKER.CLIENT_ID)
    private readonly client: ClientProxy,
  ) {}

  async publishTopic(topic: string, data: any) {
    try {
      await this.client.send(topic, data).subscribe();
      return true;
    } catch (error) {
      console.log('Error: ', error);
      return false;
    }

    // await this.client.send(topic, data).subscribe();
    // return true;
  }

  getData(context: MqttContext, payload: any) {
    // TODO: Implement the logic to get the data from the topic and save it to the database

    console.log('Topic: ', context.getTopic());
    console.log('Payload: ', payload);
    return true;
  }
}
