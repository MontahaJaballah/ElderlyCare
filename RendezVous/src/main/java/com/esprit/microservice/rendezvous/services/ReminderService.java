package com.esprit.microservice.rendezvous.services;

import com.esprit.microservice.rendezvous.entities.RendezVous;
import com.esprit.microservice.rendezvous.repositories.RendezVousRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReminderService {

    @Autowired
    private RendezVousRepository rendezVousRepository;

    /*@Autowired
    private JavaMailSender mailSender;*/

    @Autowired
    private SmsService smsService;

    // Scheduled task to send reminders (every day at 9 AM)
    @Scheduled(cron = "0 45 21 * * ?")  // Runs every day at 9:15 PM
    public void sendAppointmentReminders() {
        List<RendezVous> rendezVousList = rendezVousRepository.findAllByDateHeureBetween(
                LocalDateTime.now(),
                LocalDateTime.now().plusDays(1) // Get appointments for the next day
        );

        for (RendezVous rendezVous : rendezVousList) {
            //sendEmailReminder(rendezVous);
            sendSmsReminder(rendezVous);
        }
    }

    /*
    private void sendEmailReminder(RendezVous rendezVous) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(rendezVous.getPersonneAgee().getEmail());
        message.setSubject("Appointment Reminder");
        message.setText("Dear " + rendezVous.getPersonneAgee().getNom() + ",\n\n"
                + "This is a reminder for your appointment with "
                + rendezVous.getProfessionnelSante().getNom() + " at "
                + rendezVous.getDateHeure() + ".\n\n"
                + "Thank you,\nElderlyCareHub");
        mailSender.send(message);
    }
    */

    private void sendSmsReminder(RendezVous rendezVous) {
        String phoneNumber = rendezVous.getPersonneAgee().getTelephone();
        String message = "Rappel: Votre rendez-vous avec " + rendezVous.getProfessionnelSante().getNom()
                + " est prévu le " + rendezVous.getDateHeure() + ".";
        smsService.sendSms(phoneNumber, message);
    }
}
