import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry, delay } from 'rxjs/operators';
import { RendezVous, ProfessionnelSante, PersonneAgee } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private readonly baseUrl = '/api/rendez-vous';
  private readonly personneAgeeUrl = '/api/personnes-agees';
  private readonly professionnelUrl = '/api/professionnels';

  constructor(private readonly http: HttpClient) { }

  // Error handler
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);

    if (error.status === 0) {
      console.error('Network error or CORS issue:', error.error);
    } else {
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
    }

    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }

  // Get appointments by patient ID
  getRendezVousParPersonne(idPersonneAgee: number): Observable<RendezVous[]> {
    return this.http.get<RendezVous[]>(`${this.baseUrl}/parPersonne/${idPersonneAgee}`);
  }

  // Get appointments by professional ID
  getRendezVousParProfessionnel(idProfessionnel: number): Observable<RendezVous[]> {
    return this.http.get<RendezVous[]>(`${this.baseUrl}/parProfessionnel/${idProfessionnel}`);
  }

  // Create new appointment
  ajouterRendezVous(idPersonneAgee: number, idProfessionnel: number, dateHeure: string): Observable<RendezVous> {
    let params = new HttpParams()
      .set('idPersonneAgee', idPersonneAgee.toString())
      .set('idProfessionnel', idProfessionnel.toString())
      .set('dateHeure', dateHeure);

    return this.http.post<RendezVous>(`${this.baseUrl}/ajouter`, null, { params });
  }

  // Reschedule appointment
  reprogrammerRendezVous(id: number, nouvelleDateHeure: string): Observable<RendezVous> {
    let params = new HttpParams().set('nouvelleDateHeure', nouvelleDateHeure);
    return this.http.put<RendezVous>(`${this.baseUrl}/reprogrammer/${id}`, null, { params });
  }

  // Cancel appointment
  annulerRendezVous(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/annuler/${id}`);
  }

  // Get all professionals (doctors)
  getAllProfessionnels(): Observable<ProfessionnelSante[]> {
    return this.http.get<ProfessionnelSante[]>(`${this.professionnelUrl}/all`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Get professional by ID
  getProfessionnelById(id: number): Observable<ProfessionnelSante> {
    return this.http.get<ProfessionnelSante>(`${this.professionnelUrl}/${id}`);
  }

  // Get all specialties
  getAllSpecialites(): Observable<string[]> {
    return this.http.get<string[]>(`${this.professionnelUrl}/specialites`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Get professionals by specialty
  getProfessionnelsBySpecialite(specialite: string): Observable<ProfessionnelSante[]> {
    return this.http.get<ProfessionnelSante[]>(`${this.professionnelUrl}/par-specialite/${specialite}`);
  }

  // Get available time slots for a professional on a specific date
  getDisponibilites(idProfessionnel: number, date: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.professionnelUrl}/${idProfessionnel}/disponibilites`, {
      params: { date }
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // Get patient by ID
  getPersonneAgeeById(id: number): Observable<PersonneAgee> {
    return this.http.get<PersonneAgee>(`${this.personneAgeeUrl}/${id}`);
  }
}
