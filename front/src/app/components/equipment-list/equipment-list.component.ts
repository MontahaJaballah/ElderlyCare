import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentService } from '../../services/equipment.service';
import { Equipment } from '../../models/equipment.model';

@Component({
  selector: 'app-equipment-list',
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class EquipmentListComponent implements OnInit {
  equipment: Equipment[] = [];
  chartUrl: string = '';
  error: string = '';

  constructor(private readonly equipmentService: EquipmentService) { }

  ngOnInit(): void {
    this.loadEquipment();
    this.loadAvailabilityChart();
  }

  loadEquipment(): void {
    this.equipmentService.getAllEquipment().subscribe({
      next: (data) => {
        this.equipment = data;
      },
      error: (err) => {
        this.error = 'Failed to load equipment: ' + err.message;
      }
    });
  }

  loadAvailabilityChart(): void {
    this.equipmentService.getEquipmentAvailabilityChart().subscribe({
      next: (blob) => {
        this.chartUrl = URL.createObjectURL(blob);
      },
      error: (err) => {
        this.error = 'Failed to load chart: ' + err.message;
      }
    });
  }
}
