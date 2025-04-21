import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RendezVous, ProfessionnelSante } from '../../models/appointment.model';
import { AppointmentService } from '../../services/appointment.service';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
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

  // Hardcoded patient ID - in a real app, this would come from authentication
  private readonly patientId = 1; // Replace with actual patient ID or get from auth service

  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSpecialites();
    this.loadProfessionnels();

    // Listen for specialty changes to filter professionals
    this.appointmentForm.get('specialite')?.valueChanges.subscribe((specialite: string) => {
      this.filterProfessionnelsBySpecialite(specialite);
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

  loadProfessionnels(): void {
    this.appointmentService.getAllProfessionnels().subscribe({
      next: (data: ProfessionnelSante[]) => {
        this.professionnels = data;
        this.filteredProfessionnels = [...this.professionnels];
      },
      error: (err: any) => {
        this.error = 'Échec du chargement des professionnels: ' + err.message;
      }
    });
  }

  filterProfessionnelsBySpecialite(specialite: string): void {
    if (!specialite) {
      this.filteredProfessionnels = [...this.professionnels];
      return;
    }
    
    this.filteredProfessionnels = this.professionnels.filter(prof => prof.specialite === specialite);
  }

  loadDisponibilites(): void {
    const idProfessionnel = this.appointmentForm.get('idProfessionnel')?.value;
    const date = this.appointmentForm.get('date')?.value;
    
    if (!idProfessionnel || !date) {
      // Clear time slots if either professional or date is not selected
      this.availableTimeSlots = [];
      this.appointmentForm.get('heure')?.setValue('');
      return;
    }
    
    console.log('Loading time slots for professional:', idProfessionnel, 'on date:', date);
    
    this.appointmentService.getDisponibilites(idProfessionnel, date).subscribe({
      next: (data: string[]) => {
        console.log('Received time slots:', data);
        this.availableTimeSlots = data;
        
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
        console.error('Failed to load time slots:', err);
        this.error = 'Échec du chargement des disponibilités: ' + err.message;
        this.availableTimeSlots = [];
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
      this.patientId,
      formValues.idProfessionnel,
      dateHeure
    ).subscribe({
      next: (response: RendezVous) => {
        this.isSubmitting = false;
        this.success = 'Rendez-vous réservé avec succès!';
        this.appointmentForm.reset();
        
        // Navigate to confirmation page or show confirmation message
        setTimeout(() => {
          this.router.navigate(['/confirmation'], { state: { rendezvous: response } });
        }, 1500);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.error = 'Échec de la réservation: ' + (err.error?.message || err.message || 'Erreur inconnue');
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
