import { Injectable, NotFoundException } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';
import { Mission } from './mission.interface';

@Injectable()
export class MissionService {
  private filePath = 'data/missions.json';

  private readData(): Mission[] {
    const data = readFileSync(this.filePath, 'utf-8');
    return JSON.parse(data) as Mission[];
  }

  private writeData(data: Mission[]): void {
    writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  findAll(): Mission[] {
    return this.readData();
  }

  findOne(id: string): Mission {
    const missions = this.readData();
    const mission = missions.find((m) => m.id === id);

    if (!mission) {
      throw new NotFoundException();
    }

    return mission;
  }

  create(body: {
    codename: string;
    riskLevel: string;
    targetName: string;
    startDate: string;
  }): Mission {
    const missions = this.readData();

    const newId =
      missions.length > 0
        ? Math.max(...missions.map((m) => Number(m.id))) + 1
        : 1;

    const newMission: Mission = {
      id: String(newId),
      codename: body.codename,
      status: 'ACTIVE',
      riskLevel: body.riskLevel,
      targetName: body.targetName,
      startDate: body.startDate,
      endDate: null,
    };

    missions.push(newMission);
    this.writeData(missions);

    return newMission;
  }

  remove(id: string): { message: string } {
    const missions = this.readData();

    const index = missions.findIndex((m) => m.id === id);

    if (index === -1) {
      throw new NotFoundException();
    }

    missions.splice(index, 1);

    this.writeData(missions);

    return {
      message: `Mission ID ${id} has been successfully deleted.`,
    };
  }
}