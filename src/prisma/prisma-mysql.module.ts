import { Global, Module } from '@nestjs/common';
import { PrismaMySqlService } from './prisma-mysql.service';

@Global() // Раскомментируйте, если хотите сделать сервис доступным глобально
@Module({
  providers: [PrismaMySqlService],
  exports: [PrismaMySqlService],
})
export class PrismaMySqlModule {}
