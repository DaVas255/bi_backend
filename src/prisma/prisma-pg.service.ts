import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient as PrismaPgClient } from '@prisma/client-pg'; // Импорт из сгенерированной папки PG

@Injectable()
export class PrismaPgService
  extends PrismaPgClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService) {
    super({
      datasources: {
        db_pg: { // Имя datasource из pg/schema.prisma
          url: config.get<string>('POSTGRES_URL'),
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('PostgreSQL Prisma Client connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('PostgreSQL Prisma Client disconnected');
  }
}
