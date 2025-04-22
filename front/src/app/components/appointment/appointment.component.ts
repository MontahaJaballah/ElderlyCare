import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AppointmentService } from '../../services/appointment.service';
import { UserType } from '../../models/user.model';
import { RendezVous, StatutRendezVous } from '../../models/appointment.model';

// Interface for our frontend display
interface AppointmentDisplay {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  patientName?: string;
  patientPhone?: string;
  doctorName?: string;
  doctorSpecialty?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  // User information
  userType: string | null = null;
  isDoctor = false;
  appointments: AppointmentDisplay[] = [];
  rawAppointments: RendezVous[] = [];
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 5;
  totalItems = 0;
  
  // Date filtering
  selectedDate: string = new Date().toISOString().split('T')[0]; // Today's date
  dates: string[] = [];
  
  // Selected appointment for details view
  selectedAppointment: AppointmentDisplay | null = null;
  
  // Loading state
  loading = false;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.isDoctor = this.userType === UserType.PROFESSIONNEL_SANTE;
    
    // Generate dates for the next 7 days for the tabs
    this.generateDates();
    
    // Load appointments
    this.loadAppointments();
  }

  generateDates(): void {
    const today = new Date();
    this.dates = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      this.dates.push(date.toISOString().split('T')[0]);
    }
  }

  loadAppointments(): void {
    this.loading = true;
    this.error = null;
    
    // Use the appointment service to get real appointments from Spring Boot
    this.appointmentService.getMesRendezVous().subscribe({
      next: (data) => {
        this.rawAppointments = data;
        // Convert backend appointments to our display format
        this.appointments = this.convertAppointments(data);
        // Filter by selected date
        this.filterAppointmentsByDate();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.error = error.message || 'Failed to load appointments';
        this.loading = false;
        
        // Fall back to mock data in development
        if (error.status === 0) { // Connection error, likely in development
          console.warn('Using mock data as fallback');
          this.appointments = this.getMockAppointments();
          this.filterAppointmentsByDate();
        }
      }
    });
  }

  // Convert backend RendezVous objects to our frontend display format
  convertAppointments(rendezVousList: RendezVous[]): AppointmentDisplay[] {
    return rendezVousList.map(rdv => {
      // Extract date and time parts
      const dateTime = new Date(rdv.dateHeure);
      const date = dateTime.toISOString().split('T')[0];
      const startHour = dateTime.getHours();
      const startMinute = dateTime.getMinutes();
      const endHour = startHour + 1; // Assume 1 hour appointments
      
      // Format times
      const startTime = `${startHour}:${startMinute.toString().padStart(2, '0')}`;
      const endTime = `${endHour}:${startMinute.toString().padStart(2, '0')}`;
      
      // Map status
      let status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
      switch(rdv.statut) {
        case StatutRendezVous.TERMINE:
          status = 'COMPLETED';
          break;
        case StatutRendezVous.ANNULE:
          status = 'CANCELLED';
          break;
        default:
          status = 'SCHEDULED';
      }
      
      // Create display object based on user type
      return {
        id: rdv.idRendezVous ? rdv.idRendezVous.toString() : '0',
        date,
        startTime,
        endTime,
        patientName: this.isDoctor && typeof rdv.personneAgee !== 'number' ? 
          `${rdv.personneAgee.prenom} ${rdv.personneAgee.nom}` : undefined,
        patientPhone: this.isDoctor && typeof rdv.personneAgee !== 'number' ? 
          rdv.personneAgee.telephone : undefined,
        doctorName: !this.isDoctor && typeof rdv.professionnelSante !== 'number' ? 
          `Dr. ${rdv.professionnelSante.prenom} ${rdv.professionnelSante.nom}` : undefined,
        doctorSpecialty: !this.isDoctor && typeof rdv.professionnelSante !== 'number' ? 
          rdv.professionnelSante.specialite : undefined,
        status,
        notes: rdv.remarques || 'No additional notes'
      };
    });
  }
  
  // Filter appointments by selected date
  filterAppointmentsByDate(): void {
    const filtered = this.appointments.filter(appointment => appointment.date === this.selectedDate);
    this.appointments = filtered;
    this.totalItems = filtered.length;
  }
  
  // Mock data for development and testing
  getMockAppointments(): AppointmentDisplay[] {
    // Generate mock appointments for demonstration
    const mockAppointments: AppointmentDisplay[] = [];
    const today = new Date();
    
    for (let i = 0; i < 20; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + Math.floor(i / 3)); // Distribute across days
      
      const startHour = 9 + (i % 8); // Appointments from 9 AM to 4 PM
      const endHour = startHour + 1;
      
      mockAppointments.push({
        id: `appt-${i + 1}`,
        date: date.toISOString().split('T')[0],
        startTime: `${startHour}:00`,
        endTime: `${endHour}:00`,
        patientName: this.isDoctor ? `Patient ${i + 1}` : undefined,
        patientPhone: this.isDoctor ? `+1-555-${100 + i}` : undefined,
        doctorName: !this.isDoctor ? `Dr. Smith ${i % 4 + 1}` : undefined,
        doctorSpecialty: !this.isDoctor ? ['CARDIOLOGY', 'DENTISTRY', 'GYNECOLOGY', 'ORTHOPAD'][i % 4] : undefined,
        status: ['SCHEDULED', 'COMPLETED', 'CANCELLED'][Math.floor(Math.random() * 3)] as 'SCHEDULED' | 'COMPLETED' | 'CANCELLED',
        notes: `Appointment notes ${i + 1}`
      });
    }
    
    return mockAppointments;
  }

  changeDate(date: string): void {
    this.selectedDate = date;
    // If we have raw appointments, just filter them
    if (this.rawAppointments.length > 0) {
      this.appointments = this.convertAppointments(this.rawAppointments);
      this.filterAppointmentsByDate();
    } else {
      // Otherwise reload from server
      this.loadAppointments();
    }
    this.currentPage = 1; // Reset to first page when changing date
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get paginatedAppointments(): AppointmentDisplay[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.appointments.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  viewAppointmentDetails(appointment: AppointmentDisplay): void {
    this.selectedAppointment = appointment;
  }

  closeDetails(): void {
    this.selectedAppointment = null;
  }

  getFormattedTime(time: string): string {
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  }

  getFormattedDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }
}
