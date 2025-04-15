import { Module } from '@nestjs/common';
import { PrismaMySqlService } from '../prisma/prisma-mysql.service';
import { ImsController } from './ims.controller';
import { ImsService } from './ims.service';

@Module({
  controllers: [ImsController],
  providers: [ImsService, PrismaMySqlService],
  exports: [ImsService]
})
export class ImsModule { }
