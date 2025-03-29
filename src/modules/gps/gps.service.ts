import { Inject, Injectable } from '@nestjs/common';
import { PATTERNS } from './gps.constants';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { Gps } from './schemas/gps.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GpsDto } from './dto/gps-dto';

@Injectable()
export class GpsService {
  constructor(
    @InjectModel(Gps.name) private readonly gpsModel: Model<Gps>,
    @Inject('BACKEND_MICROSERVICE_CLIENT')
    private readonly backendMicroservice: ClientProxy
  ) {}

  // B2B microservice messages section

  sendMessagePattern(message: string) {
    return firstValueFrom(
      this.backendMicroservice.send(PATTERNS.MESSAGE.SEND_MESSAGE, { message }),
    );
  }

  sendEventPattern(message: string) {
    return firstValueFrom(
      this.backendMicroservice.emit(PATTERNS.EVENTS.RECEIVE_MESSAGE, {
        message,
      }),
    );
  }

  // IoT MQTT messages section
  async saveGpsData(data: GpsDto) {
    try {
      const gpsData = new this.gpsModel(data);
      await gpsData.save();
    } catch (error) {
      console.error('Error saving GPS data', data);
      console.error('Error :', error.message);
      console.log('\n');
      // throw error;
    }
  }
}
