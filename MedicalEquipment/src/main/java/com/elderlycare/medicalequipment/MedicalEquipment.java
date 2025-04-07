package com.elderlycare.medicalequipment;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class MedicalEquipment implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
    private String type;
    private boolean available;
    private LocalDate manufactureDate;
    @OneToMany(mappedBy = "equipment", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<EquipmentMaintenance> maintenanceRecords;

    // Constructors
    public MedicalEquipment() {}
    public MedicalEquipment(String name, String type, boolean available) {
        this.name = name;
        this.type = type;
        this.available = available;
    }

    // Getters & Setters
    public int getId() { return id; }
     public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }

    public LocalDate getManufactureDate() { return manufactureDate; }
    public void setManufactureDate(LocalDate manufactureDate) { this.manufactureDate = manufactureDate; }

    public List<EquipmentMaintenance> getMaintenanceRecords() { return maintenanceRecords; }
    public void setMaintenanceRecords(List<EquipmentMaintenance> maintenanceRecords) {
        this.maintenanceRecords = maintenanceRecords;
    }
}
