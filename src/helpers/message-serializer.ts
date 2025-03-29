import { Serializer } from '@nestjs/microservices';

export class MessageSerializer implements Serializer {
  serialize(value: any, options: Record<string, any>): Buffer {
    return Buffer.from(JSON.stringify(value.data));
  }
}