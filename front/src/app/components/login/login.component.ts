import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { UserType } from '../../models/user.model';
import { KeycloakService } from '../../services/keycloak.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl = '';
  userTypes = UserType;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly keycloakService: KeycloakService
  ) {
    // Redirect to home if already logged in
    if (this.authService.isLoggedIn()) {
      this.redirectBasedOnUserType();
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      userType: [UserType.PERSONNE_AGEE, Validators.required]
    });

    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? '/';
  }

  // Convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    
    // Get the selected user type
    const userType = this.f['userType'].value;
    
    // Health professionals use Keycloak, elderly persons use traditional API
    if (userType === this.userTypes.PROFESSIONNEL_SANTE) {
      console.log('Health professional login - using Keycloak if available');
      
      // Try to use Keycloak for health professionals
      if (this.keycloakService.isInitialized()) {
        this.keycloakService.login()
          .then(() => {
            // Success will redirect to Keycloak
            console.log('Redirecting to Keycloak login');
          })
          .catch(err => {
            console.error('Keycloak login failed, falling back to API', err);
            this.loginWithAPI();
          });
      } else {
        // Fall back to API login if Keycloak is not initialized
        console.log('Keycloak not initialized, using API login');
        this.loginWithAPI();
      }
    } else {
      // Elderly persons always use traditional API
      console.log('Elderly person login - using traditional API');
      this.loginWithAPI();
    }
  }
  
  // Method for traditional API login
  private loginWithAPI() {
    const userType = this.f['userType'].value;
    console.log(`Logging in with API as ${userType}`);
    
    this.authService.login({
      email: this.f['email'].value,
      password: this.f['password'].value,
      userType: userType
    })
      .subscribe({
        next: () => {
          this.redirectBasedOnUserType();
        },
        error: error => {
          this.error = error.message ?? 'Login failed. Please check your credentials.';
          this.loading = false;
        }
      });
  }

  // Redirect based on user type
  private redirectBasedOnUserType() {
    if (this.returnUrl !== '/') {
      this.router.navigate([this.returnUrl]);
      return;
    }

    if (this.authService.isProfessional()) {
      this.router.navigate(['/professionnel/dashboard']);
    } else if (this.authService.isElderly()) {
      this.router.navigate(['/personneagee/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
