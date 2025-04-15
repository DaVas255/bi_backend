import { Injectable } from '@nestjs/common';

import { PrismaMySqlService } from '../prisma/prisma-mysql.service';

@Injectable()
export class ImsService {
  constructor(private prismaMySql: PrismaMySqlService) { }

  async getAll() {
    return this.prismaMySql.mdl_local_ims_logs.findMany();
  }
}
