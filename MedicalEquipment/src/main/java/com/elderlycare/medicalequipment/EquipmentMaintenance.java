package com.elderlycare.medicalequipment;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.io.Serializable;
import java.time.LocalDate;

@Entity
public class EquipmentMaintenance implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private LocalDate maintenanceDate;
    private String description;

    @ManyToOne
    @JoinColumn(name = "equipment_id")
    @JsonBackReference
    private MedicalEquipment equipment;

    // Constructors
    public EquipmentMaintenance() {}
    public EquipmentMaintenance(LocalDate maintenanceDate, String description, MedicalEquipment equipment) {
        this.maintenanceDate = maintenanceDate;
        this.description = description;
        this.equipment = equipment;
    }

    // Getters & Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public LocalDate getMaintenanceDate() { return maintenanceDate; }
    public void setMaintenanceDate(LocalDate maintenanceDate) { this.maintenanceDate = maintenanceDate; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public MedicalEquipment getEquipment() { return equipment; }
    public void setEquipment(MedicalEquipment equipment) { this.equipment = equipment; }
}
