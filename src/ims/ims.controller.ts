import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ImsService } from './ims.service';

@Controller('ims')
export class ImsController {
  constructor(private readonly imsService: ImsService) { }

  @Get('courses-with-ims')
  async getCoursesWithIms(){
    return this.imsService.getCoursesWithIms();
  }

  @Get('course/:courseId')
  async getImsByCourseId(
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return this.imsService.getImsByCourseId(courseId);
  }

  @Get('ims/all-logs')
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
