import { PrismaPgService } from '../prisma/prisma-pg.service';

import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaPgService],
  exports: [UserService]
})
export class UserModule { }
