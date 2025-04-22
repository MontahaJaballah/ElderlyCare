// Generic User interface that can represent both types of users
export interface User {
  id?: string | number;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  userType: UserType;
  [key: string]: any; // Allow additional properties based on user type
}

export enum Specialite {
  CARDIOLOGY = 'CARDIOLOGY',
  DENTISTRY = 'DENTISTRY',
  GYNECOLOGY = 'GYNECOLOGY',
  ORTHOPAD = 'ORTHOPAD'
}

export enum UserType {
  PROFESSIONNEL_SANTE = 'PROFESSIONNEL_SANTE',
  PERSONNE_AGEE = 'PERSONNE_AGEE'
}

export interface Disponibilite {
  id?: number;
  date: string;
  heureDebut: string;
  heureFin: string;
  professionnelSante?: ProfessionnelSante;
}

export interface PersonneAgee {
  idPersonneAgee?: number;
  prenom: string;
  nom: string;
  dateNaissance: string;
  adresse: string;
  telephone: string;
  email: string;
  password?: string;
}

export interface ProfessionnelSante {
  idProfessionnelSante?: number;
  prenom: string;
  nom: string;
  specialite: string;
  telephone: string;
  email: string;
  password?: string;
  disponibilites?: Disponibilite[];
}

export interface AuthResponse {
  token: string;
  type: UserType;
  user: User;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  userType: UserType;
}

export interface RegisterProfessionnelRequest {
  prenom: string;
  nom: string;
  specialite: Specialite;
  telephone: string;
  email: string;
  password: string;
}

export interface RegisterPersonneAgeeRequest {
  prenom: string;
  nom: string;
  dateNaissance: string;
  adresse: string;
  telephone: string;
  email: string;
  password: string;
}
