import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Medication } from '../../models/medication.model';
import { MedicationService } from '../../services/medication.service';

@Component({
  selector: 'app-reminder-list',
  templateUrl: './reminder-list.component.html',
  styleUrls: ['./reminder-list.component.css'],
  standalone: true,
  imports: [CommonModule, DatePipe],
  providers: [DatePipe]
})
export class ReminderListComponent implements OnInit {
  patientId = 1; // Hardcoded for now, should come from auth service
  reminders: Medication[] = [];
  error = '';
  success = '';

  constructor(private readonly medicationService: MedicationService) {}

  ngOnInit(): void {
    this.loadAllReminders();
  }

  loadAllReminders(): void {
    this.medicationService.getRemindersByPatient(this.patientId).subscribe({
      next: (reminders: Medication[]) => {
        this.reminders = reminders;
      },
      error: (err: any) => {
        this.error = 'Failed to load reminders: ' + err.message;
      }
    });
  }

  clearReminder(medicationId: number): void {
    if (confirm('Are you sure you want to clear this reminder?')) {
      this.medicationService.clearReminder(medicationId).subscribe({
        next: () => {
          this.success = 'Reminder cleared successfully!';
          this.loadAllReminders(); // Reload the list
        },
        error: (err: any) => {
          this.error = 'Failed to clear reminder: ' + err.message;
        }
      });
    }
  }
}