package tn.elderlycare.medicationservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.elderlycare.medicationservice.entity.Reminder;

import java.util.List;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    List<Reminder> findByMedication_PatientId(Long patientId);
}