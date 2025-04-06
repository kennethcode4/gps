import { Inject, Injectable } from '@nestjs/common';
import { PATTERNS } from './gps.constants';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { Gps } from './schemas/gps.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GpsDto } from './dto/gps-dto';
import { Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class GpsService {
  private readonly logger = new Logger(GpsService.name);
  private readonly CACHE_KEY_PREFIX = 'gps_position_';

  constructor(
    @InjectModel(Gps.name) private readonly gpsModel: Model<Gps>,
    @Inject('BACKEND_MICROSERVICE_CLIENT')
    private readonly backendMicroservice: ClientProxy,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
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
      const cacheKey = `${this.CACHE_KEY_PREFIX}${data.thingId}`;
      const lastPosition = await this.cacheManager.get<GpsDto>(cacheKey);
      
      if (!lastPosition || this.hasPositionChanged(lastPosition, data)) {
        const gpsData = new this.gpsModel(data);
        await gpsData.save();
        await this.cacheManager.set(cacheKey, data);
        
        this.logger.log(`GPS data saved for thingId: ${data.thingId} - New position detected`);
      } else {
        this.logger.log(`GPS data discarded for thingId: ${data.thingId} - Same position`);
      }
    } catch (error) {
      this.logger.error(`Error processing GPS data: ${error.message}`, error.stack);
      throw error;
    }
  }

  private hasPositionChanged(lastPosition: GpsDto, newData: GpsDto): boolean {
    return lastPosition.lat !== newData.lat || lastPosition.lng !== newData.lng;
  }

  // Método para obtener el historial de ubicaciones
  async getLocationHistory(thingId: string, startDate: Date, endDate: Date): Promise<Gps[]> {
    return this.gpsModel.find({
      thingId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: 1 }).exec();
  }

  // Método para limpiar el caché de un dispositivo específico
  async clearDeviceCache(thingId: string): Promise<void> {
    const cacheKey = `${this.CACHE_KEY_PREFIX}${thingId}`;
    await this.cacheManager.del(cacheKey);
    this.logger.log(`Cache cleared for device: ${thingId}`);
  }

  // Método para limpiar todo el caché
  async clearAllCache(): Promise<void> {
    // En este caso, simplemente no hacemos nada ya que el caché
    // se limpiará automáticamente según el TTL configurado
    this.logger.log('Cache will be cleared automatically based on TTL');
  }
}
