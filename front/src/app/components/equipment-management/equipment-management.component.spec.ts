import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentManagementComponent } from './equipment-management.component';

describe('EquipmentManagementComponent', () => {
  let component: EquipmentManagementComponent;
  let fixture: ComponentFixture<EquipmentManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EquipmentManagementComponent]
    });
    fixture = TestBed.createComponent(EquipmentManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
