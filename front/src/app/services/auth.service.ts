import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, AuthResponse, UserType, RegisterProfessionnelRequest, RegisterPersonneAgeeRequest, LoginRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromLocalStorage();
  }

  // Load user from localStorage on service initialization
  private loadUserFromLocalStorage() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing user data from localStorage', error);
        localStorage.removeItem('currentUser');
      }
    }
  }

  // Get current user value
  public get currentUserValue(): User | null {
    const user = this.currentUserSubject.value;
    if (user) {
      return {
        ...user,
        userType: user.userType as UserType
      };
    }
    return null;
  }

  // Register a professional healthcare provider
  registerProfessionnel(request: RegisterProfessionnelRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/register/professionnel`, request).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userType', response.type.toString());
          localStorage.setItem('currentUser', JSON.stringify({
            ...response.user,
            userType: response.type
          }));
          this.currentUserSubject.next({
            ...response.user,
            userType: response.type
          });
        }
      })
    );
  }

  // Register an elderly person
  registerPersonneAgee(request: RegisterPersonneAgeeRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/register/personneagee`, request).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userType', response.type.toString());
          localStorage.setItem('currentUser', JSON.stringify({
            ...response.user,
            userType: response.type
          }));
          this.currentUserSubject.next({
            ...response.user,
            userType: response.type
          });
        }
      })
    );
  }

  // Login user
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userType', response.type.toString());
          localStorage.setItem('currentUser', JSON.stringify({
            ...response.user,
            userType: response.type
          }));
          this.currentUserSubject.next({
            ...response.user,
            userType: response.type
          });
        }
      })
    );
  }

  // Logout user
  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    this.currentUserSubject.next(null);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Check if current user is a professional
  public isProfessional(): boolean {
    const user = this.currentUserValue;
    return user?.userType === UserType.PROFESSIONNEL_SANTE;
  }

  // Check if current user is an elderly person
  public isElderly(): boolean {
    const user = this.currentUserValue;
    return user?.userType === UserType.PERSONNE_AGEE;
  }

  // Get appointments (placeholder for now)
  getAppointments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/appointments`);
  }
}
