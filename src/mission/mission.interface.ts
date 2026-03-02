export interface Mission {
  id: string;
  codename: string;
  status: string;
  riskLevel: string;
  targetName: string;
  startDate: string;
  endDate: string | null;
}