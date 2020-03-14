import { Controller, Get } from '@nestjs/common';

export enum Routes {
    HEALTH = '/health'
}

@Controller()
export class AppController {
  @Get(Routes.HEALTH)
  health(): {} {
    return {}
  }
}
