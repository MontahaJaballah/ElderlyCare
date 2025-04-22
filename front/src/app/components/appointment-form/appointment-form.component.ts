import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RendezVous, ProfessionnelSante } from '../../models/appointment.model';
import { AppointmentService } from '../../services/appointment.service';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm!: FormGroup;
  specialites: string[] = [];
  professionnels: ProfessionnelSante[] = [];
  availableTimeSlots: string[] = [];
  isSubmitting = false;
  error = '';
  success = '';
  filteredProfessionnels: ProfessionnelSante[] = [];
  minDate: string;

  // Hardcoded patient ID - in a real app, this would come from authentication
  private readonly patientId = 1; // Replace with actual patient ID or get from auth service

  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) {
    // Set minimum date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.initForm();
    this.loadSpecialites();
    // Initialize with empty professionals list
    this.filteredProfessionnels = [];

    // Listen for specialty changes to filter professionals
    this.appointmentForm.get('specialite')?.valueChanges.subscribe((specialite: string) => {
      if (specialite) {
        this.filterProfessionnelsBySpecialite(specialite);
      } else {
        // Clear professionals list when no specialty is selected
        this.filteredProfessionnels = [];
        this.appointmentForm.get('idProfessionnel')?.setValue('');
      }
    });

    // Listen for date and professional changes to load available time slots
    this.appointmentForm.get('date')?.valueChanges.subscribe(() => {
      this.loadDisponibilites();
    });

    this.appointmentForm.get('idProfessionnel')?.valueChanges.subscribe(() => {
      this.loadDisponibilites();
    });
  }

  initForm(): void {
    this.appointmentForm = this.formBuilder.group({
      specialite: ['', Validators.required],
      idProfessionnel: ['', Validators.required],
      date: ['', Validators.required],
      heure: ['', Validators.required],
      remarques: [''],
    });
  }

  loadSpecialites(): void {
    this.appointmentService.getAllSpecialites().subscribe({
      next: (data: string[]) => {
        this.specialites = data;
      },
      error: (err: any) => {
        this.error = 'Échec du chargement des spécialités: ' + err.message;
      }
    });
  }

  // We don't need to load all professionals at once anymore
  // as we're loading them by specialty
  loadProfessionnels(): void {
    // This method is no longer used
  }

  filterProfessionnelsBySpecialite(specialite: string): void {
    if (!specialite) {
      // If no specialty is selected, clear the professionals list
      this.filteredProfessionnels = [];
      this.appointmentForm.get('idProfessionnel')?.setValue('');
      return;
    }

    // Clear professionals selection when specialty changes
    this.appointmentForm.get('idProfessionnel')?.setValue('');

    // Load professionals by specialty from the API
    this.appointmentService.getProfessionnelsBySpecialite(specialite).subscribe({
      next: (data: ProfessionnelSante[]) => {
        console.log(`Loaded ${data.length} professionals for specialty: ${specialite}`);
        this.filteredProfessionnels = data;
      },
      error: (err: any) => {
        console.error('Failed to load professionals by specialty:', err);
        this.error = 'Échec du chargement des professionnels: ' + err.message;
        this.filteredProfessionnels = [];
      }
    });
  }

  loadDisponibilites(): void {
    const idProfessionnel = this.appointmentForm.get('idProfessionnel')?.value;
    const date = this.appointmentForm.get('date')?.value;
    
    if (!idProfessionnel || !date) {
      this.availableTimeSlots = [];
      return;
    }

    this.appointmentService.getRendezVousParProfessionnel(idProfessionnel).subscribe({
      next: (appointments: RendezVous[]) => {
        console.log('Received appointments:', appointments);
        
        // Generate all possible time slots
        const allTimeSlots = this.appointmentService.generateAllTimeSlots();
        
        // Filter out time slots that are already booked
        const availableTimeSlots = allTimeSlots.filter(timeSlot => {
          return !appointments.some((appointment: RendezVous) => {
            const appointmentTime = new Date(appointment.dateHeure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            return appointmentTime === timeSlot;
          });
        });

        this.availableTimeSlots = availableTimeSlots;
        
        // If there are no appointments, show all time slots
        if (appointments.length === 0) {
          this.error = 'Aucun rendez-vous trouvé pour ce professionnel. Tous les créneaux sont disponibles.';
        } else if (availableTimeSlots.length === 0) {
          this.error = 'Tous les créneaux sont déjà réservés pour ce professionnel.';
        } else {
          this.error = '';
        }

        // Reset time selection if previously selected time is no longer available
        const currentTime = this.appointmentForm.get('heure')?.value;
        if (currentTime && !this.availableTimeSlots.includes(currentTime)) {
          this.appointmentForm.get('heure')?.setValue('');
        }
        
        // If there's only one time slot, auto-select it
        if (this.availableTimeSlots.length === 1 && !currentTime) {
          this.appointmentForm.get('heure')?.setValue(this.availableTimeSlots[0]);
        }
      },
      error: (err: any) => {
        console.error('Failed to load appointments:', err);
        this.error = 'Échec du chargement des disponibilités. Veuillez réessayer.';
        this.availableTimeSlots = this.appointmentService.generateAllTimeSlots();
      }
    });
  }

  onSubmit(): void {
    if (this.appointmentForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.appointmentForm.controls).forEach(key => {
        this.appointmentForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.error = '';
    this.success = '';

    const formValues = this.appointmentForm.value;

    // Combine date and time into ISO format string (YYYY-MM-DDTHH:MM:SS)
    const dateHeure = this.formatDateTime(formValues.date, formValues.heure);

    // Validate the combined date-time
    if (!dateHeure) {
      this.error = 'Invalid date or time format';
      this.isSubmitting = false;
      return;
    }

    console.log('Submitting appointment with date-time:', dateHeure);

    this.appointmentService.ajouterRendezVous(
      formValues.idProfessionnel,
      dateHeure
    ).subscribe({
      next: (response: RendezVous) => {
        this.isSubmitting = false;
        this.success = 'Rendez-vous réservé avec succès!';
        this.appointmentForm.reset();
        console.log('Appointment added:', response);

        // Navigate to confirmation page or show confirmation message
        setTimeout(() => {
          this.router.navigate(['/confirmation'], { state: { rendezvous: response } });
        }, 1500);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        console.error('Appointment creation error:', err);
        
        // Show a more user-friendly error message
        let errorMessage = '';
        if (err.status === 500) {
          errorMessage = 'Le serveur a rencontré une erreur. Veuillez réessayer plus tard.';
        } else if (err.status === 404) {
          errorMessage = 'Le professionnel sélectionné n\'a pas été trouvé.';
        } else {
          errorMessage = err.message || 'Erreur lors de la réservation. Veuillez réessayer.';
        }
        
        alert(errorMessage);
        this.error = errorMessage;
      }
    });
  }

  // Helper method to format date and time for the API
  formatDateTime(date: string, time: string): string {
    // Ensure we have both date and time
    if (!date || !time) {
      console.error('Date or time is missing', { date, time });
      return '';
    }

    // Format: yyyy-MM-ddTHH:mm:ss
    // Make sure time has seconds
    const formattedTime = time.includes(':') && time.split(':').length === 2
      ? `${time}:00`
      : time;

    return `${date}T${formattedTime}`;
  }
}
