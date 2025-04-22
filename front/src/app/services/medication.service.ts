import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Medication } from '../models/medication.model';

@Injectable({
  providedIn: 'root'
})
export class MedicationService {
  private readonly baseUrl = 'http://localhost:8082/medications'; // Adjust this URL to match your backend server

  constructor(private readonly http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'Something went wrong. Please try again later.';

    if (error.status === 0) {
      errorMessage = 'Cannot connect to the server. Please check your connection.';
    } else if (error.status === 404) {
      errorMessage = 'The requested resource was not found.';
    } else if (error.status === 500) {
      errorMessage = 'Internal server error. Please try again later.';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }

    return throwError(() => new Error(errorMessage));
  }

  addMedication(patientId: number, medicationData: any): Observable<Medication> {
    const payload = { ...medicationData, patientId };
    return this.http.post<Medication>(`${this.baseUrl}`, payload).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getMedicationsByPatient(patientId: number): Observable<Medication[]> {
    return this.http.get<Medication[]>(`${this.baseUrl}/patient/${patientId}`).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateMedication(id: number, medicationData: any): Observable<Medication> {
    return this.http.put<Medication>(`${this.baseUrl}/${id}`, medicationData).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  setReminder(medicationId: number, reminderTime: string): Observable<Medication> {
    return this.http.post<Medication>(`${this.baseUrl}/reminder/${medicationId}`, { reminderTime }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  clearReminder(medicationId: number): Observable<Medication> {
    return this.http.delete<Medication>(`${this.baseUrl}/reminder/${medicationId}`).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getRemindersByPatient(patientId: number): Observable<Medication[]> {
    return this.http.get<Medication[]>(`${this.baseUrl}/reminders/patient/${patientId}`).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getAllReminders(): Observable<Medication[]> {
    return this.http.get<Medication[]>(`${this.baseUrl}/reminders/all`).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
  deleteMedication(medicationId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${medicationId}`).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getQrCode(medicationId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/qr/${medicationId}`, { responseType: 'blob' }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
}