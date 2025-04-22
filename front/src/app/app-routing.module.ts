import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EquipmentListComponent } from './components/equipment-list/equipment-list.component';
import { EquipmentManagementComponent } from './components/equipment-management/equipment-management.component';
import { HomeComponent } from './components/home/home.component';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';
import { AppointmentComponent } from './components/appointment/appointment.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthTestComponent } from './components/auth-test/auth-test.component';
import { AuthGuard } from './services/auth.guard';
import { MedicationFormComponent } from './components/medication-form/medication-form.component';
import { ReminderListComponent } from './components/reminder-list/reminder-list.component';

import { DoctorComponent } from './components/doctor/doctor.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'equipment', component: EquipmentManagementComponent, canActivate: [AuthGuard] },
  { path: 'equipment-list', component: EquipmentListComponent, canActivate: [AuthGuard] },
  { path: 'appointment', component: AppointmentFormComponent, canActivate: [AuthGuard] },
  { path: 'appointments', component: AppointmentComponent, canActivate: [AuthGuard] },
  { path: 'mes-rendez-vous', component: AppointmentComponent, canActivate: [AuthGuard] },
  { path: 'auth-test', component: AuthTestComponent, canActivate: [AuthGuard] },
  { path: 'medication', component: MedicationFormComponent },
  { path: 'reminders', component: ReminderListComponent },
  { path: 'doctors', component: DoctorComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
