import { Controller, Get } from '@nestjs/common'
import { ImsService } from './ims.service'

@Controller('')
export class ImsController {
  constructor(private readonly imsService: ImsService) { }

  @Get('ims')
  async getAll() {
    return this.imsService.getAll()
  }

  @Get('ims/users')
  async getUsersFromLogs() {
    return this.imsService.getUsersFromLogs()
  }

  @Get('ims/components')
  async getComponentsOfIms() {
    return this.imsService.getComponentsOfIms()
  }
}
