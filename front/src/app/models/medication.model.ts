export interface Medication {
    id: number; 
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate?: string;
    notes?: string;
    patientId: number;
    reminderTime?: string;
    taken?: boolean;
  }