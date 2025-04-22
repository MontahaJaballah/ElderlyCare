import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { KeycloakService } from '../services/keycloak.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private readonly router: Router, private readonly keycloakService: KeycloakService) {}

  // Check if URL is for equipment endpoints that require authentication
  private isProtectedEquipmentEndpoint(url: string): boolean {
    return url.includes('/api/equipment/weather-monitoring') || 
           url.includes('/api/equipment/flag-old');
  }
  
  // Check if URL requires authentication
  private requiresAuthentication(url: string): boolean {
    return this.isProtectedEquipmentEndpoint(url);
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get the JWT token from Keycloak service or fallback to localStorage
    const token = this.keycloakService.getToken() || localStorage.getItem('token');
    
    // Check if this is a protected endpoint that requires authentication
    const isProtected = this.requiresAuthentication(request.url);
    
    // For protected endpoints, ensure we have a token
    if (isProtected && !token) {
      console.log('Protected endpoint requires authentication but no token available');
      // Try to redirect to login page
      try {
        this.router.navigate(['/login']);
      } catch (e) {
        console.error('Failed to redirect to login page', e);
      }
      return throwError(() => new HttpErrorResponse({
        error: 'Authentication required',
        status: 401,
        statusText: 'Unauthorized'
      }));
    }
    
    // Add token to request if available (for any endpoint)
    if (token) {
      const authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return next.handle(authRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          // Only handle 401/403 errors for protected endpoints
          if ((error.status === 401 || error.status === 403) && isProtected) {
            console.error('Authentication error for protected endpoint:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('userType');
            this.router.navigate(['/login']);
          }
          return throwError(() => error);
        })
      );
    }
    
    // If no token and not a protected endpoint, pass the original request
    return next.handle(request);
  }
}
