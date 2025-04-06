package tn.elderlycare.medicationservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.elderlycare.medicationservice.dto.ReminderRequest;
import tn.elderlycare.medicationservice.entity.Reminder;
import tn.elderlycare.medicationservice.service.ReminderService;

import java.util.List;

@RestController
@RequestMapping("/reminders")
public class ReminderController {

    @Autowired
    private ReminderService reminderService;

    @PostMapping("/medication/{medicationId}")
    public ResponseEntity<Reminder> setReminder(@PathVariable Long medicationId, @RequestBody ReminderRequest reminderRequest) {
        return ResponseEntity.ok(reminderService.setReminder(medicationId, reminderRequest.getReminderTime()));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Reminder>> getRemindersByPatientId(@PathVariable Long patientId) {
        return ResponseEntity.ok(reminderService.getRemindersByPatientId(patientId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Reminder>> getAllReminders() {
        return ResponseEntity.ok(reminderService.getAllReminders());
    }
}