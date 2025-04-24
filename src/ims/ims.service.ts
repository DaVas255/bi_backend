import { Injectable, } from '@nestjs/common';
import { PrismaMySqlService } from '../prisma/prisma-mysql.service';

export interface SerializedIms {
  id: number;
  course: number;
  name: string;
  intro: string | null;
  introformat: number;
  revision: number;
  keepold: number;
  structure: string | null;
  timemodified: number;
  cmid: number | null;
}

export interface GetImsByCourseIdResult {
  trackedIms: SerializedIms[];
  untrackedIms: SerializedIms[];
}

@Injectable()
export class ImsService {
  constructor(private prismaMySql: PrismaMySqlService) {}

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

       const safeBigIntToNumber = (value: bigint | null | undefined): number | null => {
         if (value === null || value === undefined) return null;
         if (value > BigInt(Number.MAX_SAFE_INTEGER) || value < BigInt(Number.MIN_SAFE_INTEGER)) {
           console.warn(`BigInt value ${value} is outside the safe integer range for JavaScript Number. Consider using string.`);
           return Number(value);
         }
         return Number(value);
       };

       const serializedCourses = coursesWithIms.map(course => ({
         ...course,
         id: safeBigIntToNumber(course.id)!,
         category: safeBigIntToNumber(course.category)!,
         sortorder: safeBigIntToNumber(course.sortorder)!,
         startdate: safeBigIntToNumber(course.startdate)!,
         enddate: safeBigIntToNumber(course.enddate)!,
         marker: safeBigIntToNumber(course.marker)!,
         maxbytes: safeBigIntToNumber(course.maxbytes)!,
         defaultgroupingid: safeBigIntToNumber(course.defaultgroupingid)!,
         timecreated: safeBigIntToNumber(course.timecreated)!,
         timemodified: safeBigIntToNumber(course.timemodified)!,
         originalcourseid: safeBigIntToNumber(course.originalcourseid),
         cacherev: safeBigIntToNumber(course.cacherev)!,
         mdl_imscp: course.mdl_imscp.map(ims => ({
           ...ims,
           id: safeBigIntToNumber(ims.id)!,
           course: safeBigIntToNumber(ims.course)!,
           revision: safeBigIntToNumber(ims.revision)!,
           keepold: safeBigIntToNumber(ims.keepold)!,
           timemodified: safeBigIntToNumber(ims.timemodified)!,
         })),
       }));

       return serializedCourses;
     } catch (error) {
       console.error('Ошибка при получении курсов с IMS:', error);
       throw error; 
     }
   }

  async getImsByCourseId(courseId: number): Promise<GetImsByCourseIdResult> {
    try {
      const imsList = await this.prismaMySql.mdl_imscp.findMany({
        where: {
          course: BigInt(courseId),
        },
      });

      if (!imsList || imsList.length === 0) {
        return { trackedIms: [], untrackedIms: [] };
      }

      const imsInstanceIds = imsList.map((ims) => ims.id);

      const IMS_MODULE_ID = 26;
      const imsCourseModules = await this.prismaMySql.mdl_course_modules.findMany({
        where: {
          course: BigInt(courseId),
          module: BigInt(IMS_MODULE_ID),
          instance: {
            in: imsInstanceIds,
          },
        },
        select: {
          id: true,
          instance: true,
        },
      });

      const imsInstanceToCmIdMap = new Map<number, number>(
        imsCourseModules.map((cm) => [Number(cm.instance), Number(cm.id)]),
      );

      const courseSpecificCmIds = imsCourseModules.map(cm => cm.id);

      let loggedCmIds = new Set<number>();

      if (courseSpecificCmIds.length > 0) {
          const loggedCmsResult = await this.prismaMySql.mdl_local_ims_logs.findMany({
              where: {
                  cm: {
                      in: courseSpecificCmIds,
                  },
              },
              select: { cm: true },
              distinct: ['cm'],
          });
          loggedCmIds = new Set(loggedCmsResult.map((log) => Number(log.cm)));
      }

      const trackedIms: SerializedIms[] = [];
      const untrackedIms: SerializedIms[] = [];

      for (const ims of imsList) {
        const imsId = Number(ims.id);
        const cmid = imsInstanceToCmIdMap.get(imsId) || null;

        const serializedIms: SerializedIms = {
          id: imsId,
          course: Number(ims.course),
          name: ims.name,
          intro: ims.intro,
          introformat: ims.introformat,
          revision: Number(ims.revision),
          keepold: Number(ims.keepold),
          structure: ims.structure,
          timemodified: Number(ims.timemodified),
          cmid: cmid,
        };

        if (cmid && loggedCmIds.has(cmid)) {
          trackedIms.push(serializedIms);
        } else {
          untrackedIms.push(serializedIms);
        }
      }

      return { trackedIms, untrackedIms };

    } catch (error) {
      console.error(
        `Ошибка при получении IMS для курса с ID ${courseId}:`,
        error,
      );
      throw error;
    }
  }

  async getAllLogs() {
     return this.prismaMySql.mdl_local_ims_logs.findMany();
   }

   async getLoggedCmIds(): Promise<number[]> {
     const logs = await this.prismaMySql.mdl_local_ims_logs.findMany({
       select: { cm: true },
       distinct: ['cm'],
     });
     return logs.map((log) => Number(log.cm));
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

     return users.map(user => ({
        ...user,
        id: Number(user.id),
        timecreated: Number(user.timecreated),
        timemodified: Number(user.timemodified),
        lastaccess: Number(user.lastaccess),
     }));
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

     return componentEntries.map(entry => entry.component);
   }
}