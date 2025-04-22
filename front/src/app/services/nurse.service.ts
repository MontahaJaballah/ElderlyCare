import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Nurse } from '../models/nurse.model';

@Injectable({
    providedIn: 'root'
})
export class NurseService {
    private apiUrl = 'http://localhost:8089/nurse/nurse';

    constructor(private http: HttpClient) { }

    getNurses(): Observable<Nurse[]> {
        return this.http.get<Nurse[]>(`${this.apiUrl}/getAllNurses`);
    }

    getNurseById(id: number): Observable<Nurse> {
        return this.http.get<Nurse>(`${this.apiUrl}/${id}`);
    }

    createNurse(nurse: Nurse): Observable<Nurse> {
        return this.http.post<Nurse>(`${this.apiUrl}/addNurse`, nurse);
    }

    updateNurse(nurse: Nurse): Observable<Nurse> {
        return this.http.put<Nurse>(`${this.apiUrl}/updateNurse`, nurse);
    }

    deleteNurse(nurse: Nurse): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/removeNurse`, { body: nurse });
    }

    getNursesByName(name: string): Observable<Nurse[]> {
        return this.http.get<Nurse[]>(`${this.apiUrl}/searchByName?name=${name}`);
    }

    getNursesByExperience(minYears: number): Observable<Nurse[]> {
        return this.http.get<Nurse[]>(`${this.apiUrl}/searchByExperience?minYears=${minYears}`);
    }
}