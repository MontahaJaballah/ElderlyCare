package tn.elderlycare.medicationservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.elderlycare.medicationservice.entity.Medication;

import java.util.List;

public interface MedicationRepository extends JpaRepository<Medication, Long> {
    @Query(value = "SELECT m FROM Medication m LEFT JOIN FETCH m.reminders WHERE m.patientId = :patientId",
            countQuery = "SELECT COUNT(m) FROM Medication m WHERE m.patientId = :patientId")
    List<Medication> findByPatientIdWithReminders(@Param("patientId") Long patientId);

    @Query(value = "SELECT m FROM Medication m WHERE m.patientId = :patientId",
            countQuery = "SELECT COUNT(m) FROM Medication m WHERE m.patientId = :patientId")
    List<Medication> findByPatientId(@Param("patientId") Long patientId);
}