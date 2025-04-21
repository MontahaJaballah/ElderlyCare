import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../services/doctor.service';
import { Doctor } from '../../models/doctor.model';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit {
  doctors: Doctor[] = [];
  doctorForm: Doctor = {
    firstName: '',
    lastName: '',
    address: '',
    telephone: undefined,
    specialization: ''
  };
  selectedDoctor: Doctor | null = null;
  isEditing: boolean = false;
  searchResult: Doctor | null = null;

  constructor(private doctorService: DoctorService) { }

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe(
      (data) => {
        this.doctors = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des médecins:', error);
      }
    );
  }

  addDoctor(): void {
    if (!this.doctorForm.firstName || !this.doctorForm.lastName || !this.doctorForm.specialization) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.doctorService.addDoctor(this.doctorForm).subscribe(
      (newDoctor) => {
        this.doctors.push(newDoctor);
        this.resetForm();
      },
      (error) => {
        console.error('Erreur lors de l\'ajout du médecin:', error);
      }
    );
  }

  searchDoctor(firstName: string, lastName: string, specialization: string): void {
    if (!firstName || !lastName || !specialization) {
      alert('Veuillez remplir tous les champs de recherche');
      return;
    }

    this.doctorService.getDoctorByNameAndLastNameAndSpecialization(firstName, lastName, specialization).subscribe(
      (doctor) => {
        this.searchResult = doctor;
      },
      (error) => {
        console.error('Erreur lors de la recherche du médecin:', error);
        this.searchResult = null;
      }
    );
  }

  editDoctor(doctor: Doctor): void {
    this.selectedDoctor = { ...doctor };
    this.doctorForm = { ...doctor };
    this.isEditing = true;
  }

  updateDoctor(): void {
    if (!this.doctorForm.firstName || !this.doctorForm.lastName || !this.doctorForm.specialization) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.doctorService.updateDoctor(this.doctorForm).subscribe(
      (updatedDoctor) => {
        const index = this.doctors.findIndex(d => d.id === updatedDoctor.id);
        if (index !== -1) {
          this.doctors[index] = updatedDoctor;
        }
        this.resetForm();
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du médecin:', error);
      }
    );
  }

  deleteDoctor(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce médecin ?')) {
      this.doctorService.deleteDoctorById(id).subscribe(
        () => {
          this.doctors = this.doctors.filter(d => d.id !== id);
        },
        (error) => {
          console.error('Erreur lors de la suppression du médecin:', error);
        }
      );
    }
  }

  resetForm(): void {
    this.doctorForm = {
      firstName: '',
      lastName: '',
      address: '',
      telephone: undefined,
      specialization: ''
    };
    this.isEditing = false;
    this.selectedDoctor = null;
  }
}
