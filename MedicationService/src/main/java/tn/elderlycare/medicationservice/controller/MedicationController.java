package tn.elderlycare.medicationservice.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.elderlycare.medicationservice.dto.MedicationDTO;
import tn.elderlycare.medicationservice.entity.Medication;
import tn.elderlycare.medicationservice.service.DrugInfoService;
import tn.elderlycare.medicationservice.service.MedicationService;
import tn.elderlycare.medicationservice.service.QrCodeService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/medications")
public class MedicationController {

    private static final Logger logger = LoggerFactory.getLogger(MedicationController.class);

    @Autowired
    private MedicationService medicationService;

    @Autowired
    private DrugInfoService drugInfoService;

    @Autowired
    private QrCodeService qrCodeService;

    @PostMapping
    public ResponseEntity<Medication> addMedication(@RequestBody MedicationDTO medicationDTO) {
        Medication medication = medicationService.addMedication(medicationDTO);
        return ResponseEntity.ok(medication);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Medication>> getMedicationsByPatientId(@PathVariable Long patientId) {
        List<Medication> medications = medicationService.getMedicationsByPatientId(patientId);
        return ResponseEntity.ok(medications);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medication> updateMedication(@PathVariable Long id, @RequestBody MedicationDTO medicationDTO) {
        Medication updatedMedication = medicationService.updateMedication(id, medicationDTO);
        return ResponseEntity.ok(updatedMedication);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedication(@PathVariable Long id) {
        medicationService.deleteMedication(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/reminder/{medicationId}")
    public ResponseEntity<Medication> setReminder(@PathVariable Long medicationId, @RequestBody MedicationDTO reminderRequest) {
        Medication medication = medicationService.setReminder(medicationId, reminderRequest.getReminderTime());
        return ResponseEntity.ok(medication);
    }

    @GetMapping("/reminders/patient/{patientId}")
    public ResponseEntity<List<Medication>> getRemindersByPatientId(@PathVariable Long patientId) {
        List<Medication> medications = medicationService.getMedicationsByPatientId(patientId);
        return ResponseEntity.ok(medications);
    }

    @GetMapping("/reminders/all")
    public ResponseEntity<List<Medication>> getAllReminders() {
        List<Medication> medications = medicationService.getAllMedications();
        return ResponseEntity.ok(medications);
    }

    @GetMapping(value = "/qr/{id}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> generateQrCode(@PathVariable Long id) {
        logger.debug("Generating QR code for medication ID: {}", id);

        Optional<Medication> medicationOptional = medicationService.getMedicationById(id);
        if (medicationOptional.isEmpty()) {
            logger.warn("Medication not found for ID: {}", id);
            return ResponseEntity.notFound().build();
        }

        Medication medication = medicationOptional.get();
        logger.debug("Fetching drug info for medication: {}", medication.getName());
        String drugInfo = drugInfoService.fetchDrugInfo(medication.getName());

        String truncatedDrugInfo = drugInfo != null && drugInfo.length() > 500
                ? drugInfo.substring(0, 500) + "..."
                : drugInfo;

        String qrContent = String.format(
                "Medication ID: %d\n" +
                        "Name: %s\n" +
                        "Dosage: %s\n" +
                        "Frequency: %s\n" +
                        "Start Date: %s\n" +
                        "Patient ID: %d\n" +
                        "Reminder Time: %s\n" +
                        "Taken: %b\n" +
                        "OpenFDA Info: %s",
                medication.getId(),
                medication.getName(),
                medication.getDosage(),
                medication.getFrequency(),
                medication.getStartDate().toString(),
                medication.getPatientId(),
                medication.getReminderTime() != null ? medication.getReminderTime().toString() : "Not set",
                medication.isTaken(),
                truncatedDrugInfo != null ? truncatedDrugInfo : "Not available"
        );

        logger.debug("QR code content length: {}", qrContent.length());
        if (qrContent.length() > 4000) {
            logger.warn("QR code content is too long ({} characters). Truncating further.", qrContent.length());
            qrContent = qrContent.substring(0, 4000);
        }

        try {
            logger.debug("Generating QR code with content: {}", qrContent);
            byte[] qrCodeImage = qrCodeService.generateQrCode(qrContent, 250, 250);
            logger.debug("QR code generated successfully for medication ID: {}", id);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .body(qrCodeImage);
        } catch (Exception e) {
            logger.error("Failed to generate QR code for medication ID: {}. Error: {}", id, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
}