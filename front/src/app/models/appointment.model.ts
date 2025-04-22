import { PersonneAgee, ProfessionnelSante } from './user.model';

// Re-export these types so they can be imported from either module
export { PersonneAgee, ProfessionnelSante };

export enum StatutRendezVous {
  PLANIFIE = 'PENDING',
  CONFIRME = 'CONFIRMED',
  ANNULE = 'CANCELED',
  TERMINE = 'COMPLETED'
}

export interface RendezVous {
  idRendezVous?: number;
  dateHeure: string; // LocalDateTime in ISO format
  statut?: StatutRendezVous;
  personneAgee: PersonneAgee | number; // Can be either the full object or just the ID
  professionnelSante: ProfessionnelSante | number; // Can be either the full object or just the ID
  remarques?: string;
}
