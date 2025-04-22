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
        console.warn('Equipment loading error:', err);
        this.error = 'Failed to load equipment. You may need to log in to access this data.';
        // Don't block the UI - just show empty state
        this.equipment = [];
      }
    });
  }

  loadAvailabilityChart(): void {
    this.equipmentService.getEquipmentAvailabilityChart().subscribe({
      next: (blob) => {
        this.chartUrl = URL.createObjectURL(blob);
      },
      error: (err) => {
        console.warn('Chart loading error:', err);
        // Don't block the UI - just continue without the chart
        this.chartUrl = '';
      }
    });
  }
}
