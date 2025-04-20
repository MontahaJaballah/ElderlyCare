package com.esprit.microservice.rendezvous.services;

import com.esprit.microservice.rendezvous.entities.RendezVous;
import com.esprit.microservice.rendezvous.repositories.RendezVousRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class ReminderService {

    private static final Logger log = LoggerFactory.getLogger(ReminderService.class);

    @Autowired
    private RendezVousRepository rendezVousRepository;

    /*@Autowired
    private JavaMailSender mailSender;*/

    @Autowired
    private SmsService smsService;

    @Scheduled(cron = "0 00 09 * * ?")  // Runs every day at 11:30 PM
    public void sendAppointmentReminders() {
        LocalDateTime start = LocalDateTime.now().truncatedTo(ChronoUnit.MINUTES); // Truncate to minutes
        LocalDateTime end = start.plusDays(1).truncatedTo(ChronoUnit.SECONDS);

        log.debug("Querying for appointments between {} and {}", start, end);

        List<RendezVous> rendezVousList = rendezVousRepository.findAllByDateHeureBetween(start, end);

        if (rendezVousList.isEmpty()) {
            log.debug("No appointments found between {} and {}", start, end);
        }

        for (RendezVous rendezVous : rendezVousList) {
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
