import { Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';
import { AppointmentComponent } from './components/appointment/appointment.component';
import { AuthTestComponent } from './components/auth-test/auth-test.component';
import { DoctorComponent } from './components/doctor/doctor.component';
import { EquipmentListComponent } from './components/equipment-list/equipment-list.component';
import { EquipmentManagementComponent } from './components/equipment-management/equipment-management.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MedicationFormComponent } from './components/medication-form/medication-form.component';
import { NurseComponent } from './components/nurse/nurse.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ReminderListComponent } from './components/reminder-list/reminder-list.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthGuard } from './services/auth.guard';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule, HeaderComponent, FooterComponent],
  standalone: true
})
export class AppComponent {
  title = 'ElderlyCare';
}

@NgModule({
  declarations: [
    // Non-standalone components must be declared here
    ProfileComponent,
    NurseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    // Import standalone components
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    EquipmentListComponent,
    EquipmentManagementComponent,
    AppointmentFormComponent,
    AppointmentComponent,
    LoginComponent,
    SignupComponent,
    AuthTestComponent,
    DoctorComponent,
    MedicationFormComponent,
    ReminderListComponent,
    AppComponent
  ],
  providers: [
    AuthService,
    AuthGuard,
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
