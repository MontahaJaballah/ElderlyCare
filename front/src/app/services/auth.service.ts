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
    // Use the updated route structure
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
    // Use the updated route structure
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
    // Convert from userType to type to match backend expectations
    const payload = {
      email: credentials.email,
      password: credentials.password,
      type: credentials.userType
    };
    // Use Keycloak for authentication if available, otherwise fall back to the API
    try {
      // Try to use Keycloak first
      const keycloakService = (window as any)['keycloakService'];
      if (keycloakService && typeof keycloakService.login === 'function') {
        console.log('Using Keycloak for authentication');
        keycloakService.login();
        // This is a workaround since we're redirecting to Keycloak
        return new Observable<AuthResponse>(observer => {
          // This code won't actually run due to the redirect
          observer.next({ token: '', user: {} as User, type: credentials.userType });
          observer.complete();
        });
      }
    } catch (e) {
      console.log('Keycloak not available, falling back to API login');
    }
    
    // Fall back to API login
    // Use the updated route structure
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/login`, payload).pipe(
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
