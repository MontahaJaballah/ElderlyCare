package com.elderlycare.medicalequipment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EquipmentService {

    @Autowired
    private MedicalEquipmentRepository equipmentRepo;

    @Autowired
    private EquipmentMaintenanceRepository maintenanceRepo;

    // Equipment CRUD
    public MedicalEquipment addEquipment(MedicalEquipment equipment) {
        return equipmentRepo.save(equipment);
    }

    public List<MedicalEquipment> getAllEquipment() {
        return equipmentRepo.findAll();
    }

    public void deleteEquipment(int id) {
        equipmentRepo.deleteById(id);
    }

    // Maintenance CRUD
    public EquipmentMaintenance addMaintenance(EquipmentMaintenance maintenance) {
        return maintenanceRepo.save(maintenance);
    }

    public List<EquipmentMaintenance> getAllMaintenance() {
        return maintenanceRepo.findAll();
    }

    public void deleteMaintenance(int id) {
        maintenanceRepo.deleteById(id);
    }
}
