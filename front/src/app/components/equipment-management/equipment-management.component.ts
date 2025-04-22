import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EquipmentService } from '../../services/equipment.service';
import { Equipment } from '../../models/equipment.model';

@Component({
  selector: 'app-equipment-management',
  templateUrl: './equipment-management.component.html',
  styleUrls: ['./equipment-management.component.css'],
  imports: [CommonModule, FormsModule, DatePipe],
  standalone: true
})
export class EquipmentManagementComponent implements OnInit {
  equipment: Equipment[] = [];
  selectedEquipment: Equipment | null = null;
  newEquipment: Equipment = {} as Equipment;
  searchCode: string = '';
  weatherCity: string = 'tunis';
  aiQuestion: string = '';
  aiResponse: any = null;
  weatherData: any = null;
  flaggedEquipment: any[] = [];
  error: string = '';
  success: string = '';
  activeTab: string = 'list';
  equipmentStats: any = null;

  constructor(private readonly equipmentService: EquipmentService) { }

  ngOnInit(): void {
    this.loadEquipment();
    this.loadEquipmentStats();
  }

  loadEquipment(): void {
    this.equipmentService.getAllEquipment().subscribe({
      next: (data) => {
        this.equipment = data;
        this.success = 'Equipment loaded successfully';
      },
      error: (err) => this.error = 'Failed to load equipment: ' + err.message
    });
  }

  addEquipment(): void {
    this.equipmentService.addEquipment(this.newEquipment).subscribe({
      next: (data) => {
        this.equipment.push(data);
        this.newEquipment = {} as Equipment;
        this.success = 'Equipment added successfully';
      },
      error: (err) => this.error = 'Failed to add equipment: ' + err.message
    });
  }

  deleteEquipment(id: number): void {
    if (confirm('Are you sure you want to delete this equipment?')) {
      this.equipmentService.deleteEquipment(id).subscribe({
        next: () => {
          this.equipment = this.equipment.filter(e => e.id !== id);
          this.success = 'Equipment deleted successfully';
        },
        error: (err) => this.error = 'Failed to delete equipment: ' + err.message
      });
    }
  }

  searchByCode(): void {
    if (this.searchCode) {
      this.equipmentService.getEquipmentByCode(this.searchCode).subscribe({
        next: (data) => {
          this.selectedEquipment = data;
          this.success = 'Equipment found';
        },
        error: (err) => this.error = 'Equipment not found: ' + err.message
      });
    }
  }

  getWeather(): void {
    this.equipmentService.getWeatherMonitoring(this.weatherCity).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.success = `Weather data received for ${this.weatherCity}`;
      },
      error: (err) => this.error = 'Failed to get weather data: ' + err.message
    });
  }

  flagOldEquipment(): void {
    this.equipmentService.flagOldEquipment().subscribe({
      next: (data) => {
        this.flaggedEquipment = data;
        this.success = 'Old equipment flagged';
        this.loadEquipment(); // Reload to see updates
      },
      error: (err) => this.error = 'Failed to flag old equipment: ' + err.message
    });
  }

  askAIQuestion(): void {
    if (this.aiQuestion) {
      this.equipmentService.askAI(this.aiQuestion).subscribe({
        next: (response) => {
          this.aiResponse = response;
          this.success = 'AI response received';
        },
        error: (err) => this.error = 'Failed to get AI response: ' + err.message
      });
    }
  }

  loadEquipmentStats(): void {
    this.equipmentService.getEquipmentAvailabilityChart().subscribe({
      next: (data) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.equipmentStats = reader.result;
        };
        reader.readAsDataURL(data);
      },
      error: (err) => console.error('Failed to load equipment stats:', err)
    });
  }

  generatePDF(id: number): void {
    this.equipmentService.generatePDF(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `equipment-${id}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.success = 'PDF generated successfully';
      },
      error: (err) => this.error = 'Failed to generate PDF: ' + err.message
    });
  }

  clearMessages(): void {
    this.error = '';
    this.success = '';
  }
}
