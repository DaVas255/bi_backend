import { Injectable } from '@nestjs/common';

import { PrismaMySqlService } from '../prisma/prisma-mysql.service';

@Injectable()
export class ImsService {
  constructor(private prismaMySql: PrismaMySqlService) { }

 async getCoursesWithIms() {
  try {
    const coursesWithIms = await this.prismaMySql.mdl_course.findMany({
      where: {
        mdl_imscp: {
          some: {},
        },
      },
      include: {
        mdl_imscp: true,
      },
    });

    const serializedCourses = coursesWithIms.map(course => ({
      ...course,
      id: Number(course.id),
      category: Number(course.category),
      sortorder: Number(course.sortorder),
      startdate: Number(course.startdate),
      enddate: Number(course.enddate),
      marker: Number(course.marker),
      maxbytes: Number(course.maxbytes),
      defaultgroupingid: Number(course.defaultgroupingid),
      timecreated: Number(course.timecreated),
      timemodified: Number(course.timemodified),
      originalcourseid: course.originalcourseid ? Number(course.originalcourseid) : null,
      cacherev: Number(course.cacherev),
      mdl_imscp: course.mdl_imscp.map(ims => ({
        ...ims,
        id: Number(ims.id),
        course: Number(ims.course),
        revision: Number(ims.revision),
        keepold: Number(ims.keepold),
        timemodified: Number(ims.timemodified),
      })),
    }));

    return serializedCourses;
  } catch (error) {
    console.error('Ошибка при получении курсов с IMS:', error);
    throw error;
  }
}

  async getImsByCourseId(courseId: number) {
  try {
    const imsList = await this.prismaMySql.mdl_imscp.findMany({
      where: {
        course: courseId,
      },
    });
    const serializedImsList = imsList.map(ims => ({
      ...ims,
      id: Number(ims.id),
      course: Number(ims.course),
      revision: Number(ims.revision),
      keepold: Number(ims.keepold),
      timemodified: Number(ims.timemodified),
    }));
    return serializedImsList;
  } catch (error) {
    console.error(`Ошибка при получении IMS для курса с ID ${courseId}:`, error);
    throw error;
  }
}

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
