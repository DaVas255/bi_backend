import { Global, Module } from '@nestjs/common';
import { PrismaPgService } from './prisma-pg.service';

@Global() // Раскомментируйте, если хотите сделать сервис доступным глобально
@Module({
  providers: [PrismaPgService],
  exports: [PrismaPgService],
})
export class PrismaPgModule {}
