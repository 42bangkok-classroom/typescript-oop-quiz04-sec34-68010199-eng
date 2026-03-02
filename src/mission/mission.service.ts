import { Injectable, NotFoundException } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';
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

  findOne(id: string, clearance: string = 'STANDARD') {
    const filePath = join(process.cwd(), 'data', 'missions.json');
    const data = readFileSync(filePath, 'utf-8');
    const missions: IMission[] = JSON.parse(data);

    const mission = missions.find(m => m.id === id);

    if (!mission) {
      throw new NotFoundException('Not Found');
    }

    const result = { ...mission };

    if (
      (result.riskLevel === 'HIGH' || result.riskLevel === 'CRITICAL') &&
      clearance !== 'TOP_SECRET'
    ) {
      result.targetName = '***REDACTED***';
    }

    return result;
  }

  create(body: any) {
    const filePath = join(process.cwd(), 'data', 'missions.json');
    const data = readFileSync(filePath, 'utf-8');
    const missions: IMission[] = JSON.parse(data);

    const lastId =
      missions.length > 0
        ? Math.max(...missions.map(m => Number(m.id)))
        : 0;

    const newMission = {
      id: String(lastId + 1),
      codename: body.codename,
      status: 'ACTIVE',
      targetName: body.targetName,
      riskLevel: body.riskLevel,
      startDate: body.startDate,
      endDate: null
    };

    missions.push(newMission);

    writeFileSync(filePath, JSON.stringify(missions, null, 2));

    return newMission;
  }

  remove(id: string) {
    const filePath = join(process.cwd(), 'data', 'missions.json');
    const data = readFileSync(filePath, 'utf-8');
    const missions: IMission[] = JSON.parse(data);

    const index = missions.findIndex(m => m.id === id);

    if (index === -1) {
      throw new NotFoundException('Not Found');
    }

    missions.splice(index, 1);

    writeFileSync(filePath, JSON.stringify(missions, null, 2));

    return {
      message: `Mission ID ${id} has been successfully deleted.`
    };
  }
}