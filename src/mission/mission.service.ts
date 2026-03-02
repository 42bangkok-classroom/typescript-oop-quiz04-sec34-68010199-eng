import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { IMission } from './mission.interface';

@Injectable()
export class MissionService {
  private readonly missions = [
    { id: 1, codename: 'OPERATION_STORM', status: 'ACTIVE' },
    { id: 2, codename: 'SILENT_SNAKE', status: 'COMPLETED' },
    { id: 3, codename: 'RED_DAWN', status: 'FAILED' },
    { id: 4, codename: 'BLACKOUT', status: 'ACTIVE' },
    { id: 5, codename: 'ECHO_FALLS', status: 'COMPLETED' },
    { id: 6, codename: 'GHOST_RIDER', status: 'COMPLETED' }
  ];

  getSummary() {
    return this.missions.reduce((result, mission) => {
      const status = mission.status;
      if (!result[status]) {
        result[status] = 0;
      }
      result[status]++;
      return result;
    }, {});
  }

  findAll() {
    const filePath = join(process.cwd(), 'data', 'missions.json');
    const data = readFileSync(filePath, 'utf-8');
    const missions: IMission[] = JSON.parse(data);

    return missions.map(mission => {
      let durationDays = -1;

      if (mission.endDate) {
        const start = new Date(mission.startDate).getTime();
        const end = new Date(mission.endDate).getTime();
        durationDays = (end - start) / (1000 * 60 * 60 * 24);
      }

      return {
        ...mission,
        durationDays
      };
    });
  }
}