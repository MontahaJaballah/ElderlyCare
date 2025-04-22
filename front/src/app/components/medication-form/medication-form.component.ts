import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Medication } from '../../models/medication.model';
import { MedicationService } from '../../services/medication.service';

@Component({
  selector: 'app-medication-form',
  templateUrl: './medication-form.component.html',
  styleUrls: ['./medication-form.component.css']
})
export class MedicationFormComponent implements OnInit {
  medicationForm!: FormGroup;
  reminderForm!: FormGroup;
  updateForm!: FormGroup;
  medications: Medication[] = [];
  isSubmitting = false;
  error = '';
  success = '';
  patientId = 1; // Hardcoded for now; replace with auth service
  selectedMedicationId: number | null = null;
  selectedMedicationForEdit: Medication | null = null;
  qrCodeUrl: string | null = null;
  viewMode: 'table' | 'grid' = 'table';

  constructor(
    private readonly medicationService: MedicationService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadMedications();
  }

  initForms(): void {
    this.medicationForm = this.formBuilder.group({
      name: ['', Validators.required],
      dosage: ['', Validators.required],
      frequency: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      notes: ['']
    });

    this.reminderForm = this.formBuilder.group({
      reminderTime: ['', Validators.required]
    });

    this.updateForm = this.formBuilder.group({
      name: ['', Validators.required],
      dosage: ['', Validators.required],
      frequency: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      notes: ['']
    });
  }

  loadMedications(): void {
    this.medicationService.getMedicationsByPatient(this.patientId).subscribe({
      next: (medications: Medication[]) => {
        this.medications = medications;
      },
      error: (err: any) => {
        this.error = 'Failed to load medications: ' + err.message;
      }
    });
  }

  onSubmit(): void {
    if (this.medicationForm.invalid) {
      Object.keys(this.medicationForm.controls).forEach(key => {
        this.medicationForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.error = '';
    this.success = '';

    if (this.medicationForm.invalid) {
      this.error = 'Please fill in all required fields';
      return;
    }

    const formValues = {
      name: this.medicationForm.value.name,
      dosage: this.medicationForm.value.dosage,
      frequency: this.medicationForm.value.frequency,
      startDate: this.medicationForm.value.startDate ? new Date(this.medicationForm.value.startDate).toISOString().split('T')[0] : null,
      endDate: this.medicationForm.value.endDate ? new Date(this.medicationForm.value.endDate).toISOString().split('T')[0] : null,
      notes: this.medicationForm.value.notes || '',
      patientId: this.patientId,
      taken: false
    };

    this.medicationService.addMedication(this.patientId, formValues).subscribe({
      next: (response: Medication) => {
        this.isSubmitting = false;
        this.success = 'Medication added successfully!';
        this.medicationForm.reset();
        this.loadMedications();
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.error = 'Failed to add medication: ' + err.message;
      }
    });
  }

  setReminderForMedication(medicationId: number): void {
    this.selectedMedicationId = medicationId;
  }

  setReminder(): void {
    if (this.reminderForm.invalid || !this.selectedMedicationId) {
      return;
    }

    const reminderTime = new Date(this.reminderForm.value.reminderTime).toISOString();
    this.medicationService.setReminder(this.selectedMedicationId, reminderTime).subscribe({
      next: () => {
        this.success = 'Reminder set successfully!';
        this.reminderForm.reset();
        this.selectedMedicationId = null;
        this.loadMedications();
      },
  error: (err: any) => {
        this.error = 'Failed to set reminder: ' + err.message;
      }
    });
  }

  showQrCode(medicationId: number): void {
    this.medicationService.getQrCode(medicationId).subscribe({
      next: (blob: Blob) => {
        this.qrCodeUrl = URL.createObjectURL(blob);
      },
      error: (err: any) => {
        this.error = 'Failed to load QR code: ' + err.message;
      }
    });
  }

  deleteMedication(medicationId: number): void {
    if (confirm('Are you sure you want to delete this medication?')) {
      this.medicationService.deleteMedication(medicationId).subscribe({
        next: () => {
          this.success = 'Medication deleted successfully!';
          this.loadMedications();
        },
        error: (err: any) => {
          this.error = 'Failed to delete medication: ' + err.message;
        }
      });
    }
  }

  editMedication(medication: Medication): void {
    this.selectedMedicationForEdit = medication;
    // Format dates for the form
    const startDate = medication.startDate ? medication.startDate.split('T')[0] : null;
    const endDate = medication.endDate ? medication.endDate.split('T')[0] : null;

    this.updateForm.patchValue({
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      startDate: startDate,
      endDate: endDate,
      notes: medication.notes
    });
  }

  updateMedication(): void {
    if (this.updateForm.invalid || !this.selectedMedicationForEdit) {
      return;
    }

    this.isSubmitting = true;
    this.error = '';
    this.success = '';

    const formValues = this.updateForm.value;
    
    // Format the data for the API
    const updatedValues = {
      name: formValues.name,
      dosage: formValues.dosage,
      frequency: formValues.frequency,
      startDate: formValues.startDate ? new Date(formValues.startDate).toISOString().split('T')[0] : null,
      endDate: formValues.endDate ? new Date(formValues.endDate).toISOString().split('T')[0] : null,
      notes: formValues.notes || '',
      patientId: this.selectedMedicationForEdit.patientId,
      taken: this.selectedMedicationForEdit.taken
    };

    this.medicationService.updateMedication(this.selectedMedicationForEdit.id!, updatedValues).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.success = 'Medication updated successfully!';
        this.selectedMedicationForEdit = null;
        this.updateForm.reset();
        this.loadMedications();
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.error = 'Failed to update medication: ' + err.message;
      }
    });
  }

  cancelEdit(): void {
    this.selectedMedicationForEdit = null;
    this.updateForm.reset();
  }

  getSelectedMedicationName(): string {
    const medication = this.medications.find(m => m.id === this.selectedMedicationId);
    return medication ? medication.name : '';
  }

  clearReminder(medicationId: number): void {
    if (confirm('Are you sure you want to clear this reminder?')) {
      this.medicationService.clearReminder(medicationId).subscribe({
        next: () => {
          this.success = 'Reminder cleared successfully!';
          this.loadMedications();
        },
        error: (err: any) => {
          this.error = 'Failed to clear reminder: ' + err.message;
        }
      });
    }
  }
}