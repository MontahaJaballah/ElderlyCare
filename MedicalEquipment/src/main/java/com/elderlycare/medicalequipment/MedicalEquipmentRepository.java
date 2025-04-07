package com.elderlycare.medicalequipment;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MedicalEquipmentRepository extends JpaRepository<MedicalEquipment, Integer> {
    Optional<MedicalEquipment> findByEquipmentCode(String equipmentCode);
    
    // Count equipment by availability status
    long countByAvailable(boolean available);
}
