import { Inject, Injectable } from '@nestjs/common';
import { PATTERNS } from './gps.constants';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class GpsService {
  constructor(
    @Inject('BACKEND_MICROSERVICE_CLIENT')
    private readonly backendMicroservice: ClientProxy,
  ) {}

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
}
