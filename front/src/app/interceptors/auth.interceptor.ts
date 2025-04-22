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
    // Only these specific endpoints require authentication
    return url.includes('/api/equipment/weather-monitoring') || 
           url.includes('/api/equipment/flag-old');
  }
  
  // Check if URL is for general equipment endpoints (not protected)
  private isGeneralEquipmentEndpoint(url: string): boolean {
    return url.includes('/api/equipment') && !this.isProtectedEquipmentEndpoint(url);
  }
  
  // Check if URL requires authentication
  private requiresAuthentication(url: string): boolean {
    return this.isProtectedEquipmentEndpoint(url);
  }
  
  // Check if the current user is a health professional
  private isHealthProfessional(): boolean {
    const userType = localStorage.getItem('userType');
    return userType === 'PROFESSIONNEL_SANTE';
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get the JWT token from Keycloak service or fallback to localStorage
    const token = this.keycloakService.getToken() || localStorage.getItem('token');
    
    // Check if this is a protected endpoint that requires authentication
    const isProtected = this.requiresAuthentication(request.url);
    const isGeneralEquipment = this.isGeneralEquipmentEndpoint(request.url);
    const isHealthPro = this.isHealthProfessional();
    
    // For general equipment endpoints, just pass through without token requirements
    if (isGeneralEquipment) {
      console.log('General equipment endpoint - no authentication required');
      return next.handle(request);
    }
    
    // For protected endpoints, ensure we have a token and the user is a health professional
    if (isProtected) {
      if (!token) {
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
      } else if (!isHealthPro) {
        console.log('Protected endpoint requires health professional role');
        return throwError(() => new HttpErrorResponse({
          error: 'Insufficient permissions',
          status: 403,
          statusText: 'Forbidden'
        }));
      }
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
            
            // If the user is a health professional, try to refresh the token via Keycloak
            if (isHealthPro && this.keycloakService.isInitialized()) {
              console.log('Attempting to refresh token for health professional');
              try {
                // Just redirect to login instead of trying to refresh token
                localStorage.removeItem('token');
                localStorage.removeItem('userType');
                this.router.navigate(['/login']);
              } catch (e) {
                console.error('Error during token refresh:', e);
                localStorage.removeItem('token');
                localStorage.removeItem('userType');
                this.router.navigate(['/login']);
              }
            } else {
              // For non-health professionals or if Keycloak isn't initialized
              localStorage.removeItem('token');
              localStorage.removeItem('userType');
              this.router.navigate(['/login']);
            }
          }
          return throwError(() => error);
        })
      );
    }
    
    // If no token and not a protected endpoint, pass the original request
    return next.handle(request);
  }
}
