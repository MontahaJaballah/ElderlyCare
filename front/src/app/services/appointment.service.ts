import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry, delay, map } from 'rxjs/operators';
import { RendezVous, ProfessionnelSante, PersonneAgee, StatutRendezVous } from '../models/appointment.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private readonly baseUrl = '/api/rendezvous';
  private readonly personneAgeeUrl = '/api/personnes-agees';
  private readonly professionnelUrl = '/api/professionnels';

  constructor(
    private readonly http: HttpClient,
    private authService: AuthService
  ) { }

  // Error handler
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);

    if (error.status === 0) {
      console.error('Network error or CORS issue:', error.error);
      return throwError(() => new Error('Unable to connect to the server. Please check your network connection.'));
    } else if (error.status === 400) {
      console.error('Bad Request:', error.error);
      // Extract the specific error message from the backend
      const errorMessage = error.error?.error || 'Invalid request data.';
      return throwError(() => new Error(errorMessage));
    } else if (error.status === 500) {
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
      return throwError(() => new Error('The server encountered an error. Please try again later.'));
    } else if (error.status === 404) {
      return throwError(() => new Error('The requested resource was not found.'));
    } else {
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
      return throwError(() => new Error(`Server error (${error.status}): ${error.error?.message || 'Unknown error'}`));
    }
  }

  // Get appointments by patient ID
  getRendezVousParPersonne(idPersonneAgee: number): Observable<RendezVous[]> {
    return this.http.get<RendezVous[]>(`${this.baseUrl}/parPersonne/${idPersonneAgee}`)
      .pipe(
        retry(1),
        catchError(error => {
          console.error('Error fetching patient appointments:', error);
          return this.handleError(error);
        })
      );
  }

  // Get appointments by professional ID
  getRendezVousParProfessionnel(idProfessionnel: number): Observable<RendezVous[]> {
    console.log(`Fetching appointments for professional ID: ${idProfessionnel}`);

    return this.http.get<RendezVous[]>(`${this.baseUrl}/parProfessionnel/${idProfessionnel}`)
      .pipe(
        retry(1),
        catchError(error => {
          console.error('Error fetching professional appointments:', error);

          // If we get a 404, it means there are no appointments for this professional
          if (error.status === 404) {
            console.log('No appointments found for this professional - returning empty array');
            return of([]);
          }

          return this.handleError(error);
        })
      );
  }
  
  // Get current user's appointments
  getMesRendezVous(): Observable<RendezVous[]> {
    return this.http.get<RendezVous[]>(`${this.baseUrl}/mes-rendez-vous`)
      .pipe(
        retry(1),
        catchError(error => {
          console.error('Error fetching user appointments:', error);
          if (error.status === 401 || error.status === 403) {
            // Handle authentication errors
            this.authService.logout();
            return throwError(() => new Error('Authentication error. Please log in again.'));
          }
          return this.handleError(error);
        })
      );
  }



  // Create new appointment (for patients only)
  ajouterRendezVous(idProfessionnel: number, dateHeure: string): Observable<RendezVous> {
    console.log('Creating appointment:', {
      idProfessionnel,
      dateHeure
    });

    // Note: We don't need to pass idPersonneAgee anymore as it's extracted from the JWT token
    const params = new HttpParams()
      .set('idProfessionnel', idProfessionnel.toString())
      .set('dateHeure', dateHeure);

    return this.http.post<RendezVous>(`${this.baseUrl}/ajouter`, null, { params })
      .pipe(
        retry(1),
        catchError(error => {
          console.error('Error creating appointment:', error);
          if (error.status === 401 || error.status === 403) {
            // Handle authentication errors
            return throwError(() => new Error('You must be logged in as a patient to create appointments.'));
          }
          return this.handleError(error);
        })
      );
  }

  // Reschedule appointment
  reprogrammerRendezVous(id: number, nouvelleDateHeure: string): Observable<RendezVous> {
    // The JWT token will be automatically added by the interceptor
    // The backend will check if the user has permission to reschedule this appointment
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

  // Get all specialties (using hardcoded values since it's an enum in the backend)
  getAllSpecialites(): Observable<string[]> {
    // Using hardcoded values since specialties are an enum in the backend
    const specialties = [
      'CARDIOLOGY',
      'DENTISTRY',
      'GYNECOLOGY',
      'ORTHOPAD'
    ];
    return of(specialties);
  }

  // Get professionals by specialty
  getProfessionnelsBySpecialite(specialite: string): Observable<ProfessionnelSante[]> {
    return this.http.get<ProfessionnelSante[]>(`${this.professionnelUrl}/bySpecialite/${specialite}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }



  // Generate available time slots for a professional on a specific date
  getDisponibilites(idProfessionnel: number, date: string): Observable<string[]> {
    // Get all appointments for this professional
    return this.http.get<RendezVous[]>(`${this.baseUrl}/parProfessionnel/${idProfessionnel}`).pipe(
      retry(1),
      catchError(this.handleError),
      map(appointments => {
        // Check if appointments is null, undefined, or empty array
        if (!appointments || appointments.length === 0) {
          console.log('No appointments found for this professional, showing all time slots');
          return this.generateAllTimeSlots();
        }

        // Filter appointments for the selected date
        const appointmentsOnDate = appointments.filter(appointment => {
          // Extract just the date part from the appointment dateHeure
          const appointmentDate = appointment.dateHeure.split('T')[0];
          return appointmentDate === date;
        });

        // Get the booked time slots
        const bookedTimeSlots = appointmentsOnDate.map(appointment => {
          // Extract just the time part from the appointment dateHeure
          return appointment.dateHeure.split('T')[1].substring(0, 5); // Format: HH:MM
        });

        // Generate all possible time slots
        const allTimeSlots = this.generateAllTimeSlots();

        // Return available time slots (all slots minus booked slots)
        return allTimeSlots.filter(slot => !bookedTimeSlots.includes(slot));
      }),
      catchError(error => {
        console.error('Error getting available time slots:', error);
        // Return all time slots as fallback when there's an error
        return of(this.generateAllTimeSlots());
      })
    );
  }

  // Generate all possible time slots from 8:00 to 18:00 with 30-minute intervals
  public generateAllTimeSlots(): string[] {
    const timeSlots: string[] = [];
    const startHour = 8; // 8:00 AM
    const endHour = 18; // 6:00 PM
    const intervalMinutes = 30;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        let timeStr = hour.toString().padStart(2, '0') + ':' + minute.toString().padStart(2, '0');
        timeSlots.push(timeStr);
      }
    }
    return timeSlots;
  }

  // Helper method to format time slots for display
  public formatTimeSlot(time: string): string {
    const [hours, minutes] = time.split(':');
    return `${hours}h${minutes}`;
  }

  // Get patient by ID
  getPersonneAgeeById(id: number): Observable<PersonneAgee> {
    return this.http.get<PersonneAgee>(`${this.personneAgeeUrl}/${id}`);
  }
}
