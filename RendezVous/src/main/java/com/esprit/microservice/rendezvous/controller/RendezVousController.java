package com.esprit.microservice.rendezvous.controller;

import com.esprit.microservice.rendezvous.entities.RendezVous;
import com.esprit.microservice.rendezvous.services.RendezVousService;
import com.esprit.microservice.rendezvous.services.SmsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
@RequestMapping("/api/rendezvous")
@RequiredArgsConstructor
public class RendezVousController {
    private final RendezVousService rendezVousService;

    @PostMapping("/ajouter")
    public RendezVous ajouterRendezVous(
            @RequestParam Long idPersonneAgee,
            @RequestParam Long idProfessionnel,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime dateHeure) {
        return rendezVousService.ajouterRendezVous(idPersonneAgee, idProfessionnel, dateHeure);
    }

    @GetMapping("/parPersonne/{id}")
    public List<RendezVous> getRendezVousParPersonne(@PathVariable Long id) {
        return rendezVousService.getRendezVousParPersonneAgee(id);
    }

    @GetMapping("/parProfessionnel/{id}")
    public List<RendezVous> getRendezVousParProfessionnel(@PathVariable Long id) {
        return rendezVousService.getRendezVousParProfessionnel(id);
    }

    // ✅ Reschedule appointment
    @PutMapping("/reprogrammer/{id}")
    public RendezVous reprogrammerRendezVous(@PathVariable Long id, @RequestParam LocalDateTime nouvelleDateHeure) {
        return rendezVousService.reprogrammerRendezVous(id, nouvelleDateHeure);
    }

    // ✅ Cancel appointment
    @DeleteMapping("/annuler/{id}")
    public void annulerRendezVous(@PathVariable Long id) {
        rendezVousService.annulerRendezVous(id);
    }
}
