export interface Equipment {
  id: number;
  name: string;
  description: string;
  equipmentCode: string;
  type: string;
  available: boolean;
  status: string;
  purchaseDate?: Date;
  lastMaintenanceDate?: Date;
}
