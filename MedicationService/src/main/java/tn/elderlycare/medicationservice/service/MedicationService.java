package tn.elderlycare.medicationservice.service;

import jakarta.mail.MessagingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.elderlycare.medicationservice.dto.MedicationDTO;
import tn.elderlycare.medicationservice.entity.Medication;
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
    private DrugInfoService drugInfoService;

    @Autowired
    private EmailService emailService;

    public MedicationService(MedicationRepository medicationRepository,
                             DrugInfoService drugInfoService,
                             EmailService emailService) {
        this.medicationRepository = medicationRepository;
        this.drugInfoService = drugInfoService;
        this.emailService = emailService;
    }

    public Medication addMedication(MedicationDTO medicationDTO) {
        logger.debug("Starting addMedication for medication: {}", medicationDTO.getName());

        logger.debug("Fetching drug info for medication: {}", medicationDTO.getName());
        String drugInfo = drugInfoService.fetchDrugInfo(medicationDTO.getName());
        logger.info("Drug info for {}: {}", medicationDTO.getName(), drugInfo);

        Medication medication = new Medication();
        medication.setPatientId(medicationDTO.getPatientId());
        medication.setName(medicationDTO.getName());
        medication.setDosage(medicationDTO.getDosage());
        medication.setFrequency(medicationDTO.getFrequency());
        medication.setStartDate(medicationDTO.getStartDate());
        medication.setEndDate(medicationDTO.getEndDate());
        medication.setReminderTime(medicationDTO.getReminderTime());
        medication.setTaken(medicationDTO.isTaken());

        logger.debug("Saving medication to database");
        Medication savedMedication = medicationRepository.save(medication);

        if (savedMedication.getReminderTime() == null) {
            try {
                logger.debug("Generating reminders for medication: {}", savedMedication.getName());
                LocalDateTime startTime = LocalDateTime.of(savedMedication.getStartDate(), java.time.LocalTime.of(8, 0));
                List<LocalDateTime> dosageTimes = FrequencyParser.calculateNextDosageTimes(savedMedication.getFrequency(), startTime, 3);
                for (LocalDateTime dosageTime : dosageTimes) {
                    Medication dose = new Medication();
                    dose.setPatientId(savedMedication.getPatientId());
                    dose.setName(savedMedication.getName());
                    dose.setDosage(savedMedication.getDosage());
                    dose.setFrequency(savedMedication.getFrequency());
                    dose.setStartDate(savedMedication.getStartDate());
                    dose.setEndDate(savedMedication.getEndDate());
                    dose.setReminderTime(dosageTime);
                    dose.setTaken(false);
                    medicationRepository.save(dose);
                    logger.info("Generated reminder for medication {} at {}", savedMedication.getName(), dosageTime);
                }
            } catch (Exception e) {
                logger.error("Error generating reminders for medication {}: {}", savedMedication.getName(), e.getMessage());
                throw new MedicationServiceException("Failed to generate reminders: " + e.getMessage(), e);
            }
        }

        logger.debug("Completed addMedication for medication: {}", savedMedication.getName());
        return savedMedication;
    }

    @Transactional(readOnly = true)
    public List<Medication> getMedicationsByPatientId(Long patientId) {
        List<Medication> medications = medicationRepository.findByPatientId(patientId);
        if (medications.isEmpty()) {
            throw new MedicationServiceException("No medications found for patient ID: " + patientId);
        }
        return medications;
    }

    @Transactional(readOnly = true)
    public Optional<Medication> getMedicationById(Long id) {
        return medicationRepository.findById(id);
    }

    public Medication updateMedication(Long id, MedicationDTO medicationDTO) {
        Medication existing = medicationRepository.findById(id)
                .orElseThrow(() -> new MedicationServiceException("Medication not found with ID: " + id));
        existing.setName(medicationDTO.getName());
        existing.setDosage(medicationDTO.getDosage());
        existing.setFrequency(medicationDTO.getFrequency());
        existing.setStartDate(medicationDTO.getStartDate());
        existing.setEndDate(medicationDTO.getEndDate());
        existing.setPatientId(medicationDTO.getPatientId());
        existing.setReminderTime(medicationDTO.getReminderTime());
        existing.setTaken(medicationDTO.isTaken());
        return medicationRepository.save(existing);
    }

    public void deleteMedication(Long id) {
        if (!medicationRepository.existsById(id)) {
            throw new MedicationServiceException("Medication not found with ID: " + id);
        }
        medicationRepository.deleteById(id);
    }

    public Medication setReminder(Long medicationId, LocalDateTime reminderTime) {
        Medication medication = medicationRepository.findById(medicationId)
                .orElseThrow(() -> new MedicationServiceException("Medication not found with ID: " + medicationId));
        medication.setReminderTime(reminderTime);
        medication.setTaken(false);
        return medicationRepository.save(medication);
    }

    public List<Medication> getAllMedications() {
        return medicationRepository.findAll();
    }

    @Scheduled(fixedRate = 60000)
    public void checkReminders() {
        logger.info("Checking for overdue reminders...");
        List<Medication> medications = medicationRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        for (Medication medication : medications) {
            if (!medication.isTaken() && medication.getReminderTime() != null && medication.getReminderTime().isBefore(now)) {
                logger.info("Reminder: Time to take {} for patient {}.",
                        medication.getName(),
                        medication.getPatientId());
                medication.setTaken(true);
                medicationRepository.save(medication);

                try {
                    emailService.sendOverdueReminderEmail(medication);
                    logger.info("Sent email notification for overdue reminder: Medication {}, Patient ID {}, Time {}",
                            medication.getName(),
                            medication.getPatientId(),
                            medication.getReminderTime());
                } catch (MessagingException e) {
                    logger.error("Failed to send email for overdue reminder: Medication {}, Patient ID {}, Time {}. Error: {}",
                            medication.getName(),
                            medication.getPatientId(),
                            medication.getReminderTime(),
                            e.getMessage());
                }
            }
        }
    }
}