import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserType, Specialite } from '../../models/user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule]
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  success = '';
  userTypes = UserType;
  specialites = Object.values(Specialite);

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    // Redirect to home if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      userType: [UserType.PERSONNE_AGEE, Validators.required],
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],

      // Fields specific to PersonneAgee
      dateNaissance: [''],
      adresse: [''],

      // Fields specific to ProfessionnelSante
      specialite: [Specialite.CARDIOLOGIE]
    }, {
      validators: this.passwordMatchValidator
    });

    // Update form validation based on user type
    this.onUserTypeChange();

    // Subscribe to userType changes to update validation
    this.signupForm.get('userType')?.valueChanges.subscribe(() => {
      this.onUserTypeChange();
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  // Custom validator to check if password and confirm password match
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      return null;
    }
  }

  // Update form validation based on user type
  onUserTypeChange() {
    const userType = this.signupForm.get('userType')?.value;

    if (userType === UserType.PERSONNE_AGEE) {
      // Add validators for PersonneAgee fields
      this.signupForm.get('dateNaissance')?.setValidators([Validators.required]);
      this.signupForm.get('adresse')?.setValidators([Validators.required]);

      // Remove validators from ProfessionnelSante fields
      this.signupForm.get('specialite')?.clearValidators();
    } else {
      // Add validators for ProfessionnelSante fields
      this.signupForm.get('specialite')?.setValidators([Validators.required]);

      // Remove validators from PersonneAgee fields
      this.signupForm.get('dateNaissance')?.clearValidators();
      this.signupForm.get('adresse')?.clearValidators();
    }

    // Update validators
    this.signupForm.get('dateNaissance')?.updateValueAndValidity();
    this.signupForm.get('adresse')?.updateValueAndValidity();
    this.signupForm.get('specialite')?.updateValueAndValidity();
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    this.success = '';

    // Stop here if form is invalid
    if (this.signupForm.invalid) {
      return;
    }

    this.loading = true;

    const userType = this.signupForm.get('userType')?.value;

    if (userType === UserType.PERSONNE_AGEE) {
      this.registerPersonneAgee();
    } else {
      this.registerProfessionnel();
    }
  }

  private registerPersonneAgee() {
    this.authService.registerPersonneAgee({
      prenom: this.f['prenom'].value,
      nom: this.f['nom'].value,
      email: this.f['email'].value,
      telephone: this.f['telephone'].value,
      password: this.f['password'].value,
      dateNaissance: this.f['dateNaissance'].value,
      adresse: this.f['adresse'].value
    })
      .subscribe({
        next: () => {
          this.success = 'Registration successful!';
          this.loading = false;

          // Navigate to login after a short delay
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (error: any) => {
          this.error = error.message || 'Registration failed. Please try again.';
          this.loading = false;
        }
      });
  }

  private registerProfessionnel() {
    this.authService.registerProfessionnel({
      prenom: this.f['prenom'].value,
      nom: this.f['nom'].value,
      email: this.f['email'].value,
      telephone: this.f['telephone'].value,
      password: this.f['password'].value,
      specialite: this.f['specialite'].value
    })
      .subscribe({
        next: () => {
          this.success = 'Registration successful!';
          this.loading = false;

          // Navigate to login after a short delay
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (error: any) => {
          this.error = error.message || 'Registration failed. Please try again.';
          this.loading = false;
        }
      });
  }
}
