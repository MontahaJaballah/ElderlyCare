package tn.elderlycare.medicationservice.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Data
public class Reminder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "medication_id")
    @JsonBackReference
    private Medication medication;

    private LocalDateTime reminderTime;

    private boolean taken;

    public void setId(Long id) {
        this.id = id;
    }

    public void setMedication(Medication medication) {
        this.medication = medication;
    }

    public void setReminderTime(LocalDateTime reminderTime) {
        this.reminderTime = reminderTime;
    }

    public void setTaken(boolean taken) {
        this.taken = taken;
    }

    public Long getId() {
        return id;
    }

    public Medication getMedication() {
        return medication;
    }

    public LocalDateTime getReminderTime() {
        return reminderTime;
    }
    public Reminder() {
    }

    public Reminder(Long id, Medication medication, LocalDateTime reminderTime, boolean taken) {
        this.id = id;
        this.medication = medication;
        this.reminderTime = reminderTime;
        this.taken = taken;
    }

    public boolean isTaken() {
        return taken;
    }
}