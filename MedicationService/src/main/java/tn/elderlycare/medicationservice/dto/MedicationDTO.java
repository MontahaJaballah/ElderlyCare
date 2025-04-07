package tn.elderlycare.medicationservice.dto;

import java.time.LocalDate;

public class MedicationDTO {
    private Long id;
    private Long patientId;
    private String name;
    private String dosage;
    private String frequency;
    private LocalDate startDate;
    private LocalDate endDate;

    public MedicationDTO() {
    }

    public MedicationDTO(Long id, Long patientId, String name, String dosage, String frequency, LocalDate startDate, LocalDate endDate) {
        this.id = id;
        this.patientId = patientId;
        this.name = name;
        this.dosage = dosage;
        this.frequency = frequency;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
}