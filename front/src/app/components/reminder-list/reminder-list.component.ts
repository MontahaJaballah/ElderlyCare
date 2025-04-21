import { Component, OnInit } from '@angular/core';
import { Medication } from '../../models/medication.model';
import { MedicationService } from '../../services/medication.service';

@Component({
  selector: 'app-reminder-list',
  templateUrl: './reminder-list.component.html',
  styleUrls: ['./reminder-list.component.css']
})
export class ReminderListComponent implements OnInit {
  reminders: Medication[] = [];
  error = '';
  success = '';

  constructor(private readonly medicationService: MedicationService) {}

  ngOnInit(): void {
    this.loadAllReminders();
  }

  loadAllReminders(): void {
    this.medicationService.getAllReminders().subscribe({
      next: (reminders: Medication[]) => {
        this.reminders = reminders;
      },
      error: (err: any) => {
        this.error = 'Failed to load reminders: ' + err.message;
      }
    });
  }
}