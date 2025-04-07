package tn.elderlycare.medicationservice.dto;

import java.time.LocalDateTime;

public class ReminderRequest {
    private LocalDateTime reminderTime;

    // Default constructor
    public ReminderRequest() {}

    // Getters and setters
    public LocalDateTime getReminderTime() {
        return reminderTime;
    }

    public void setReminderTime(LocalDateTime reminderTime) {
        this.reminderTime = reminderTime;
    }
}