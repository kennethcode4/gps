import { Module } from '@nestjs/common';
import { GpsModule } from './modules/gps/gps.module';
import { MqttSubscriberModule } from './modules/mqtt-subscriber/mqtt-subscriber.module';
import { MqttPublisherModule } from './modules/mqtt-publisher/mqtt-publisher.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';
import configMongo from 'config/config-mongo';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configMongo],
      envFilePath: [`./env/${process.env.NODE_ENV}.env`],
    }),

    // MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const connectionString = `${configService.get('mongo.uri')}${configService.get('mongo.database')}${configService.get('mongo.params')}`;
        await mongoose.createConnection(connectionString).asPromise();
        return {
          connectionFactory: (connection) => {
            if (connection.readyState === 1) {
              console.log('Database connected successfully.');
            }

            connection.on('disconnected', () => {
              console.log('Database disconnected.');
            });

            connection.on('error', (error: any) =>
              console.log('Database connection failed! ', error),
            );
            return connection;
          },
          uri: connectionString,
        };
      },
    }),

    MqttSubscriberModule,
    MqttPublisherModule,
    GpsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
