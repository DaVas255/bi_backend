import { Controller, Get } from '@nestjs/common'
import { ImsService } from './ims.service'

@Controller('')
export class ImsController {
  constructor(private readonly imsService: ImsService) { }

  @Get('ims')
  async getAll() {
    return this.imsService.getAll()
  }
}
