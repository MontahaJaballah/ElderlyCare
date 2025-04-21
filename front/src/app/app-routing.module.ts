import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EquipmentListComponent } from './components/equipment-list/equipment-list.component';
import { EquipmentManagementComponent } from './components/equipment-management/equipment-management.component';
import { HomeComponent } from './components/home/home.component';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'equipment', component: EquipmentManagementComponent },
  { path: 'equipment-list', component: EquipmentListComponent },
  { path: 'appointment', component: AppointmentFormComponent },
  { path: "**", component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
