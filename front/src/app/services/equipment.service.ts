import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Equipment } from '../models/equipment.model';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
  private readonly baseUrl = '/api/equipment';
  private readonly allEquipmentUrl = `${this.baseUrl}/all`;
  private readonly statsUrl = '/api/stats';

  constructor(private readonly http: HttpClient) { }

  // Get single equipment by ID
  getEquipment(id: number): Observable<Equipment> {
    return this.http.get<Equipment>(`${this.baseUrl}/${id}`);
  }

  // Get equipment by code
  getEquipmentByCode(code: string): Observable<Equipment> {
    return this.http.get<Equipment>(`${this.baseUrl}/by-code/${code}`);
  }

  // Get all equipment
  getAllEquipment(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(this.allEquipmentUrl);
  }

  // Add new equipment
  addEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.post<Equipment>(`${this.baseUrl}/add`, equipment);
  }

  // Delete equipment
  deleteEquipment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  // Get weather monitoring
  getWeatherMonitoring(city: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/weather-monitoring`, {
      params: { city }
    });
  }

  // Flag old equipment
  flagOldEquipment(): Observable<any> {
    return this.http.get(`${this.baseUrl}/flag-old`);
  }

  // Ask AI
  askAI(question: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/ask-ai`, { question });
  }

  // Generate PDF
  generatePDF(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/generate-pdf/${id}`, {
      responseType: 'blob'
    });
  }

  // Get equipment availability chart
  getEquipmentAvailabilityChart(): Observable<Blob> {
    return this.http.get(`${this.statsUrl}/equipment/availability`, {
      responseType: 'blob'
    });
  }
}
