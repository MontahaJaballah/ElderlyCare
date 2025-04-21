export enum StatutRendezVous {
  PLANIFIE = 'PLANIFIE',
  CONFIRME = 'CONFIRME',
  ANNULE = 'ANNULE',
  TERMINE = 'TERMINE'
}

export interface PersonneAgee {
  idPersonneAgee: number;
  prenom: string;
  nom: string;
  dateNaissance?: string;
  adresse?: string;
  telephone: string;
  email?: string;
}

export interface ProfessionnelSante {
  idProfessionnelSante: number;
  prenom: string;
  nom: string;
  specialite?: string;
  telephone: string;
  email?: string;
}

export interface RendezVous {
  idRendezVous?: number;
  dateHeure: string; // LocalDateTime in ISO format
  statut?: StatutRendezVous;
  personneAgee: PersonneAgee | number; // Can be either the full object or just the ID
  professionnelSante: ProfessionnelSante | number; // Can be either the full object or just the ID
  remarques?: string;
}
