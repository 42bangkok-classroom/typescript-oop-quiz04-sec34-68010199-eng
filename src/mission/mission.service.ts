import { Injectable, NotFoundException } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import { Mission } from "./mission.interface";

@Injectable()
export class MissionService {
  private filePath = path.join(process.cwd(), "data", "missions.json");

  private readMissions(): Mission[] {
    const data = fs.readFileSync(this.filePath, "utf-8");
    return JSON.parse(data);
  }

  getSummary() {
    const missions = this.readMissions();

    const summary: Record<string, number> = {};

    missions.forEach((m) => {
      summary[m.status] = (summary[m.status] || 0) + 1;
    });

    return summary;
  }

  findAll(): any[] {
    const missions = this.readMissions();

    return missions.map((m) => {
      let durationDays = -1;

      if (m.endDate !== null) {
        const start = new Date(m.startDate).getTime();
        const end = new Date(m.endDate).getTime();
        durationDays = Math.ceil(
          (end - start) / (1000 * 60 * 60 * 24)
        );
      }

      return {
        ...m,
        durationDays,
      };
    });
  }

  findOne(id: string, clearance: string = "STANDARD"): Mission {
    const missions = this.readMissions();

    const mission = missions.find((m) => m.id === id);

    if (!mission) {
      throw new NotFoundException();
    }

    if (
      mission.riskLevel === "HIGH" &&
      clearance !== "TOP_SECRET"
    ) {
      return {
        ...mission,
        targetName: "***REDACTED***",
      };
    }

    return mission;
  }
}
