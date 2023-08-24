import { Injectable } from '@nestjs/common';
import { GoldsService } from './golds/golds.service';
import { SilversService } from './silvers/silvers.service';

@Injectable()
export class AppService {
  constructor(
  ){}
  getHello(): string {
    return 'Hello World!';
  }
  
}
