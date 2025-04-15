import { Injectable } from '@nestjs/common';

import { PrismaMySqlService } from '../prisma/prisma-mysql.service';

@Injectable()
export class ImsService {
  constructor(private prismaMySql: PrismaMySqlService) { }

  async getAll() {
    return this.prismaMySql.mdl_local_ims_logs.findMany();
  }

  async getUsersFromLogs() {
    const logEntries = await this.prismaMySql.mdl_local_ims_logs.findMany({
      select: {
        userid: true,
      },
      distinct: ['userid'],
    });

    if (!logEntries || logEntries.length === 0) {
      return [];
    }

    const userIds = logEntries.map(log => log.userid);

    const users = await this.prismaMySql.mdl_user.findMany({
      where: {
        id: {
          in: userIds, 
        },
      },
    });

    return users;
  }

  async getComponentsOfIms() {
    const componentEntries = await this.prismaMySql.mdl_local_ims_logs.findMany({
      select: {
        component: true,
      },
      distinct: ['component'],
    });

    if (!componentEntries || componentEntries.length === 0) {
      return [];
    }

    return componentEntries;
  }
}
