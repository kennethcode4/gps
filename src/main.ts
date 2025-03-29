import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MQTT } from './helpers/constants';

async function microservices(app: INestApplication<any>) {
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 3021,
    },
  });

  app.connectMicroservice({
    transport: Transport.MQTT,
    options: {
      url: `mqtt://${MQTT.BROKER.HOST}:${MQTT.BROKER.PORT}`,
    }
  })

  await app.startAllMicroservices();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await microservices(app);

  await app.listen(process.env.PORT ?? 3020).catch((err) => console.log(err));
}
bootstrap();
