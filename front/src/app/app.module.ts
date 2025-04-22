import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './interceptors/auth.interceptor';

// Services
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth.guard';

// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { EquipmentListComponent } from './components/equipment-list/equipment-list.component';
import { EquipmentManagementComponent } from './components/equipment-management/equipment-management.component';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';
import { AppointmentComponent } from './components/appointment/appointment.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthTestComponent } from './components/auth-test/auth-test.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DoctorComponent } from './components/doctor/doctor.component';
import { MedicationFormComponent } from './components/medication-form/medication-form.component';
import { ReminderListComponent } from './components/reminder-list/reminder-list.component';

@NgModule({
  declarations: [
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
    ProfileComponent,
    DoctorComponent,
    MedicationFormComponent,
    ReminderListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
