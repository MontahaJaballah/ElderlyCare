package tn.elderlycare.medicationservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.elderlycare.medicationservice.entity.Medication;
import tn.elderlycare.medicationservice.entity.Reminder;
import tn.elderlycare.medicationservice.repository.MedicationRepository;
import tn.elderlycare.medicationservice.repository.ReminderRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReminderService {

    @Autowired
    private ReminderRepository reminderRepository;

    @Autowired
    private MedicationRepository medicationRepository;

    public Reminder setReminder(Long medicationId, LocalDateTime reminderTime) {
        Medication medication = medicationRepository.findById(medicationId)
                .orElseThrow(() -> new RuntimeException("Medication not found"));
        Reminder reminder = new Reminder();
        reminder.setMedication(medication);
        reminder.setReminderTime(reminderTime);
        reminder.setTaken(false);
        return reminderRepository.save(reminder);
    }

    public List<Reminder> getRemindersByPatientId(Long patientId) {
        return reminderRepository.findByMedication_PatientId(patientId);
    }

    public List<Reminder> getAllReminders() {
        return reminderRepository.findAll();
    }

    public Reminder saveReminder(Reminder reminder) {
        return reminderRepository.save(reminder);
    }
}