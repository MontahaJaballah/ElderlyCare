package com.elderlycare.medicalequipment;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/equipment")
@CrossOrigin(origins = "*")
public class MedicalEquipmentController {

    private final MedicalEquipmentRepository equipmentRepository;

    public MedicalEquipmentController(MedicalEquipmentRepository equipmentRepository) {
        this.equipmentRepository = equipmentRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalEquipment> getEquipment(@PathVariable int id) {
        return equipmentRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-code/{code}")
    public ResponseEntity<MedicalEquipment> getEquipmentByCode(@PathVariable String code) {
        return equipmentRepository.findByEquipmentCode(code.trim())
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<MedicalEquipment> createEquipment(@RequestBody MedicalEquipment equipment) {
        // First save to get the ID
        MedicalEquipment savedEquipment = equipmentRepository.save(equipment);
        
        // Set the equipment code using the generated ID
        savedEquipment.setEquipmentCode("EQ-" + savedEquipment.getId());
        
        // Save again with the equipment code
        savedEquipment = equipmentRepository.save(savedEquipment);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(savedEquipment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicalEquipment> updateEquipment(@PathVariable int id, @RequestBody MedicalEquipment equipment) {
        if (!equipmentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        equipment.setId(id);
        return ResponseEntity.ok(equipmentRepository.save(equipment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEquipment(@PathVariable int id) {
        if (!equipmentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        equipmentRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
