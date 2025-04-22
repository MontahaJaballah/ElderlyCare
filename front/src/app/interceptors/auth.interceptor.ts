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

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get the JWT token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to the Authorization header
    if (token) {
      // Clone the request and add the Authorization header
      const authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Pass the cloned request with the token to the next handler
      return next.handle(authRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          // Handle authentication errors
          if (error.status === 401 || error.status === 403) {
            console.error('Authentication error:', error);
            
            // Clear token and redirect to login page
            localStorage.removeItem('token');
            localStorage.removeItem('userType');
            this.router.navigate(['/login']);
          }
          return throwError(() => error);
        })
      );
    }
    
    // If no token, pass the original request
    return next.handle(request);
  }
}
