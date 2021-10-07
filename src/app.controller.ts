import { Controller, Get } from '@nestjs/common';

@Controller('app')
export class AppController {
  @Get('health')
  health(): string {
    return 'OK';
  }
}
