import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { AppointmentService } from '../../services/appointment.service';

@Component({
  selector: 'app-auth-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-test.component.html',
  styleUrls: ['./auth-test.component.css']
})
export class AuthTestComponent implements OnInit {
  authStatus = 'Not checked';
  nodeAuthResponse: any = null;
  springBootResponse: any = null;
  userInfo: any = null;
  loading = false;
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    // Get user info from localStorage
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (token) {
      this.authStatus = 'Logged in';
      this.userInfo = { token: token.substring(0, 20) + '...', userType };
    } else {
      this.authStatus = 'Not logged in';
    }
  }

  testNodeAuth(): void {
    this.loading = true;
    this.error = null;
    
    // Test connection to Node.js auth server
    this.http.get('http://localhost:5000/api/auth/verify').subscribe({
      next: (response) => {
        this.nodeAuthResponse = response;
        this.loading = false;
      },
      error: (error) => {
        this.error = `Node.js Auth Error: ${error.message || 'Unknown error'}`;
        this.loading = false;
      }
    });
  }

  testSpringBoot(): void {
    this.loading = true;
    this.error = null;
    
    // Test connection to Spring Boot RendezVous service
    this.appointmentService.getMesRendezVous().subscribe({
      next: (response) => {
        this.springBootResponse = response;
        this.loading = false;
      },
      error: (error) => {
        this.error = `Spring Boot Error: ${error.message || 'Unknown error'}`;
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.authStatus = 'Logged out';
    this.userInfo = null;
    this.nodeAuthResponse = null;
    this.springBootResponse = null;
  }
}
