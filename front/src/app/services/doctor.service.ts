import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../models/doctor.model';

@Injectable({
    providedIn: 'root'
})
export class DoctorService {
    private apiUrl = 'http://localhost:8089/medecin'; // Mise à jour du port et du context path

    constructor(private http: HttpClient) { }

    getDoctors(): Observable<Doctor[]> {
        return this.http.get<Doctor[]>(`${this.apiUrl}/getMedecins`);
    }

    getDoctorByNameAndLastNameAndSpecialization(firstName: string, lastName: string, specialization: string): Observable<Doctor> {
        return this.http.get<Doctor>(`${this.apiUrl}/getMedecinByNameAndLastNameAndSpecialization`, {
            params: {
                first_name: firstName,
                last_name: lastName,
                specialization: specialization
            }
        });
    }

    addDoctor(doctor: Doctor): Observable<Doctor> {
        return this.http.post<Doctor>(`${this.apiUrl}/addMedecin`, doctor);
    }

    updateDoctor(doctor: Doctor): Observable<Doctor> {
        return this.http.put<Doctor>(`${this.apiUrl}/updateMedecin`, doctor);
    }

    deleteDoctorById(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/deleteMedecin/${id}`);
    }

    deleteDoctorByNameAndLastName(firstName: string, lastName: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/deleteMedecinByNameAndLastName`, {
            params: {
                medecin_Name: firstName,
                last_Name: lastName
            }
        });
    }
}