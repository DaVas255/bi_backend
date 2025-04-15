import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient as PrismaMySqlClient } from '@prisma/client-mysql'; // Импорт из сгенерированной папки MySQL

@Injectable()
export class PrismaMySqlService
  extends PrismaMySqlClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService) {
    super({
      datasources: {
        db_mysql: { // Имя datasource из mysql/schema.prisma
          url: config.get<string>('MYSQL_URL'),
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('MySQL Prisma Client connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('MySQL Prisma Client disconnected');
  }
}
