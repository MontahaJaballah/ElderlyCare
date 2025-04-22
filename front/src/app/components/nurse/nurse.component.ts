import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Nurse } from '../../models/nurse.model';
import { NurseService } from '../../services/nurse.service';

@Component({
    selector: 'app-nurse',
    templateUrl: './nurse.component.html',
    styleUrls: ['./nurse.component.css']
})
export class NurseComponent implements OnInit {
    nurses: Nurse[] = [];
    nurseForm: FormGroup;
    searchForm: FormGroup;
    isEditing = false;
    currentNurseId: number | null = null;
    errorMessage: string = '';
    loading: boolean = false;

    constructor(
        private nurseService: NurseService,
        private fb: FormBuilder
    ) {
        this.nurseForm = this.fb.group({
            name: ['', [Validators.required]],
            years_experience: ['', [Validators.required, Validators.min(0)]],
            speciality: ['', [Validators.required]],
            phone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
            email: ['', [Validators.required, Validators.email]]
        });

        this.searchForm = this.fb.group({
            searchName: [''],
            minExperience: [0]
        });
    }

    ngOnInit(): void {
        this.loadNurses();
    }

    loadNurses(): void {
        this.nurseService.getNurses().subscribe({
            next: (data) => {
                this.nurses = data;
                this.errorMessage = '';
            },
            error: (error) => {
                console.error('Error loading nurses:', error);
                this.errorMessage = 'Failed to load nurses. Please try again.';
            }
        });
    }

    onSubmit(): void {
        if (this.nurseForm.valid) {
            const nurseData: Nurse = this.nurseForm.value;

            if (this.isEditing && this.currentNurseId) {
                nurseData.id = this.currentNurseId;
                this.nurseService.updateNurse(nurseData).subscribe({
                    next: () => {
                        this.resetForm();
                        this.loadNurses();
                        this.errorMessage = '';
                    },
                    error: (error) => {
                        console.error('Error updating nurse:', error);
                        this.errorMessage = 'Failed to update nurse. Please try again.';
                    }
                });
            } else {
                this.nurseService.createNurse(nurseData).subscribe({
                    next: () => {
                        this.resetForm();
                        this.loadNurses();
                        this.errorMessage = '';
                    },
                    error: (error) => {
                        console.error('Error creating nurse:', error);
                        this.errorMessage = 'Failed to create nurse. Please try again.';
                    }
                });
            }
        }
    }

    editNurse(nurse: Nurse): void {
        this.isEditing = true;
        this.currentNurseId = nurse.id!;
        this.nurseForm.patchValue({
            name: nurse.name,
            years_experience: nurse.years_experience,
            speciality: nurse.speciality,
            phone: nurse.phone,
            email: nurse.email
        });
    }

    deleteNurse(nurse: Nurse): void {
        if (confirm('Are you sure you want to delete this nurse?')) {
            this.loading = true;
            this.nurseService.deleteNurse(nurse).subscribe({
                next: () => {
                    this.loading = false;
                    this.loadNurses();
                    this.errorMessage = '';
                },
                error: (error) => {
                    this.loading = false;
                    console.error('Error deleting nurse:', error);
                    this.errorMessage = 'Failed to delete nurse. Please try again.';
                }
            });
        }
    }

    onSearch(): void {
        const { searchName, minExperience } = this.searchForm.value;
        this.nurseService.getNursesByName(searchName).subscribe({
            next: (data) => {
                this.nurses = data;
                this.errorMessage = '';
            },
            error: (error) => {
                console.error('Error searching nurses:', error);
                this.errorMessage = 'Failed to search nurses. Please try again.';
            }
        });
    }

    resetForm(): void {
        this.nurseForm.reset();
        this.isEditing = false;
        this.currentNurseId = null;
    }

    refreshList(): void {
        this.loadNurses();
        this.searchForm.reset({ minExperience: 0 });
    }

    getFormValidationClass(controlName: string): string {
        const control = this.nurseForm.get(controlName);
        if (control?.touched) {
            return control.valid ? 'is-valid' : 'is-invalid';
        }
        return '';
    }
}