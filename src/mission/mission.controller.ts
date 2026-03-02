import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
} from "@nestjs/common";
import { MissionService } from "./mission.service";
import type { Mission } from "./mission.interface";

@Controller("missions")
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Get("summary")
  getSummary() {
    return this.missionService.getSummary();
  }

  @Get()
  findAll(): Mission[] {
    return this.missionService.findAll();
  }

  @Get(":id")
  findOne(
    @Param("id") id: string,
    @Query("clearance") clearance?: string
  ): Mission {
    return this.missionService.findOne(id, clearance);
  }

  @Post()
  create(@Body() body: any): Mission {
    return this.missionService.create(body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.missionService.remove(id);
  }
}