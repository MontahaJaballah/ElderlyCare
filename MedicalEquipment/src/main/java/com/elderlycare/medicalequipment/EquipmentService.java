package com.elderlycare.medicalequipment;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EquipmentService {

    private final MedicalEquipmentRepository equipmentRepo;
    private final EquipmentMaintenanceRepository maintenanceRepo;

    public EquipmentService(MedicalEquipmentRepository equipmentRepo,
                          EquipmentMaintenanceRepository maintenanceRepo) {
        this.equipmentRepo = equipmentRepo;
        this.maintenanceRepo = maintenanceRepo;
    }

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

    public List<Map<String, Object>> getFlaggedOldEquipment() {
        List<MedicalEquipment> allEquipment = equipmentRepo.findAll();
        List<Map<String, Object>> flagged = new ArrayList<>();

        LocalDate thresholdDate = LocalDate.now().minusYears(5);

        for (MedicalEquipment eq : allEquipment) {
            if (eq.getManufactureDate() != null && eq.getManufactureDate().isBefore(thresholdDate)) {
                Map<String, Object> info = new HashMap<>();
                info.put("id", eq.getId());
                info.put("name", eq.getName());
                info.put("type", eq.getType());
                info.put("manufactureDate", eq.getManufactureDate().toString());
                info.put("status", "⚠️ Replace Soon");
                flagged.add(info);
            }
        }

        return flagged;
    }
}
