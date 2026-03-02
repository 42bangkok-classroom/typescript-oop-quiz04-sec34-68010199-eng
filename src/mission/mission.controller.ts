import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { MissionService } from './mission.service';
import type { Mission } from './mission.interface';

@Controller('missions')
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Get()
  findAll(): Mission[] {
    return this.missionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Mission {
    return this.missionService.findOne(id);
  }

  @Post()
  create(
    @Body()
    body: {
      codename: string;
      riskLevel: string;
      targetName: string;
      startDate: string;
    },
  ): Mission {
    return this.missionService.create(body);
  }

  @Delete(':id')
  remove(@Param('id') id: string): { message: string } {
    return this.missionService.remove(id);
  }
}
