package com.elderlycare.medicalequipment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {

    @Autowired
    private EquipmentService equipmentService;

    // MedicalEquipment endpoints
    @PostMapping("/add")
    public MedicalEquipment addEquipment(@RequestBody MedicalEquipment equipment) {
        return equipmentService.addEquipment(equipment);
    }

    @GetMapping("/all")
    public List<MedicalEquipment> getAllEquipment() {
        return equipmentService.getAllEquipment();
    }

    @DeleteMapping("/delete/{id}")
    public void deleteEquipment(@PathVariable int id) {
        equipmentService.deleteEquipment(id);
    }

    // EquipmentMaintenance endpoints
    @PostMapping("/maintenance/add")
    public EquipmentMaintenance addMaintenance(@RequestBody EquipmentMaintenance maintenance) {
        return equipmentService.addMaintenance(maintenance);
    }

    @GetMapping("/maintenance/all")
    public List<EquipmentMaintenance> getAllMaintenance() {
        return equipmentService.getAllMaintenance();
    }

    @DeleteMapping("/maintenance/delete/{id}")
    public void deleteMaintenance(@PathVariable int id) {
        equipmentService.deleteMaintenance(id);
    }
}
