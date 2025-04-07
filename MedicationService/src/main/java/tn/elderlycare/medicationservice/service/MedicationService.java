package tn.elderlycare.medicationservice.service;

import jakarta.mail.MessagingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.elderlycare.medicationservice.entity.Medication;
import tn.elderlycare.medicationservice.entity.Reminder;
import tn.elderlycare.medicationservice.exception.MedicationServiceException;
import tn.elderlycare.medicationservice.repository.MedicationRepository;
import tn.elderlycare.medicationservice.util.FrequencyParser;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MedicationService {

    private static final Logger logger = LoggerFactory.getLogger(MedicationService.class);

    @Autowired
    private MedicationRepository medicationRepository;

    @Autowired
    private ReminderService reminderService;

    @Autowired
    private DrugInfoService drugInfoService;

    @Autowired
    private EmailService emailService;

    public MedicationService(MedicationRepository medicationRepository,
                             ReminderService reminderService,
                             DrugInfoService drugInfoService,
                             EmailService emailService) {
        this.medicationRepository = medicationRepository;
        this.reminderService = reminderService;
        this.drugInfoService = drugInfoService;
        this.emailService = emailService;
    }

    public Medication addMedication(Medication medication) {
        logger.debug("Starting addMedication for medication: {}", medication.getName());

        // Fetch drug info from OpenFDA API
        logger.debug("Fetching drug info for medication: {}", medication.getName());
        String drugInfo = drugInfoService.fetchDrugInfo(medication.getName());
        logger.info("Drug info for {}: {}", medication.getName(), drugInfo);

        // Save the medication
        logger.debug("Saving medication to database");
        Medication savedMedication = medicationRepository.save(medication);

        // Generate reminders based on frequency (e.g., for the next 3 doses)
        try {
            logger.debug("Generating reminders for medication: {}", savedMedication.getName());
            LocalDateTime startTime = LocalDateTime.of(medication.getStartDate(), java.time.LocalTime.of(8, 0)); // Assume medication starts at 8:00 AM
            List<LocalDateTime> dosageTimes = FrequencyParser.calculateNextDosageTimes(medication.getFrequency(), startTime, 3);
            for (LocalDateTime dosageTime : dosageTimes) {
                reminderService.setReminder(savedMedication.getId(), dosageTime);
                logger.info("Generated reminder for medication {} at {}", savedMedication.getName(), dosageTime);
            }
        } catch (Exception e) {
            logger.error("Error generating reminders for medication {}: {}", savedMedication.getName(), e.getMessage());
            throw new MedicationServiceException("Failed to generate reminders: " + e.getMessage(), e);
        }

        logger.debug("Completed addMedication for medication: {}", savedMedication.getName());
        return savedMedication;
    }

    @Transactional(readOnly = true)
    public List<Medication> getMedicationsByPatientId(Long patientId) {
        List<Medication> medications = medicationRepository.findByPatientIdWithReminders(patientId);
        if (medications.isEmpty()) {
            throw new MedicationServiceException("No medications found for patient ID: " + patientId);
        }
        return medications;
    }

    @Transactional(readOnly = true)
    public Optional<Medication> getMedicationById(Long id) {
        return medicationRepository.findById(id);
    }

    public Medication updateMedication(Long id, Medication updatedMedication) {
        Medication existing = medicationRepository.findById(id)
                .orElseThrow(() -> new MedicationServiceException("Medication not found with ID: " + id));
        existing.setName(updatedMedication.getName());
        existing.setDosage(updatedMedication.getDosage());
        existing.setFrequency(updatedMedication.getFrequency());
        existing.setStartDate(updatedMedication.getStartDate());
        existing.setEndDate(updatedMedication.getEndDate());
        existing.setPatientId(updatedMedication.getPatientId());
        return medicationRepository.save(existing);
    }

    public void deleteMedication(Long id) {
        if (!medicationRepository.existsById(id)) {
            throw new MedicationServiceException("Medication not found with ID: " + id);
        }
        medicationRepository.deleteById(id);
    }

    @Scheduled(fixedRate = 60000) // Runs every minute
    public void checkReminders() {
        logger.info("Checking for overdue reminders...");
        List<Reminder> reminders = reminderService.getAllReminders();
        LocalDateTime now = LocalDateTime.now();

        for (Reminder reminder : reminders) {
            if (!reminder.isTaken() && reminder.getReminderTime().isBefore(now)) {
                logger.info("Reminder: Time to take {} for patient {}.",
                        reminder.getMedication().getName(),
                        reminder.getMedication().getPatientId());
                reminder.setTaken(true);
                reminderService.saveReminder(reminder);

                // Send email notification for the overdue reminder
                try {
                    emailService.sendOverdueReminderEmail(reminder);
                    logger.info("Sent email notification for overdue reminder: Medication {}, Patient ID {}, Time {}",
                            reminder.getMedication().getName(),
                            reminder.getMedication().getPatientId(),
                            reminder.getReminderTime());
                } catch (MessagingException e) {
                    logger.error("Failed to send email for overdue reminder: Medication {}, Patient ID {}, Time {}. Error: {}",
                            reminder.getMedication().getName(),
                            reminder.getMedication().getPatientId(),
                            reminder.getReminderTime(),
                            e.getMessage());
                }
            }
        }
    }
}