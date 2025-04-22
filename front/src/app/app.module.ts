import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EquipmentListComponent } from './components/equipment-list/equipment-list.component';
import { EquipmentManagementComponent } from './components/equipment-management/equipment-management.component';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';
import { MedicationFormComponent } from './components/medication-form/medication-form.component';
import { ReminderListComponent } from './components/reminder-list/reminder-list.component';
@NgModule({
  declarations: [
    AppComponent,
    EquipmentListComponent,
    EquipmentManagementComponent,
    LoginComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    AppointmentFormComponent,
    MedicationFormComponent,
    ReminderListComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
