import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserType } from '../../models/user.model';

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
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
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
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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
    this.authService.login({
      email: this.f['email'].value,
      password: this.f['password'].value,
      userType: this.f['userType'].value
    })
      .subscribe({
        next: () => {
          this.redirectBasedOnUserType();
        },
        error: error => {
          this.error = error.message || 'Login failed. Please check your credentials.';
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
