package com.esprit.microservice.rendezvous.controller;

import com.esprit.microservice.rendezvous.entities.ProfessionnelSante;
import com.esprit.microservice.rendezvous.services.ProfessionnelSanteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professionnels")
@RequiredArgsConstructor
public class ProfessionnelSanteController {
    private final ProfessionnelSanteService professionnelSanteService;

    @PostMapping("/ajouter")
    public ProfessionnelSante ajouterProfessionnel(@RequestBody ProfessionnelSante professionnel) {
        return professionnelSanteService.ajouterProfessionnel(professionnel);
    }

    @GetMapping("/all")
    public List<ProfessionnelSante> getAllProfessionnels() {
        return professionnelSanteService.getAllProfessionnels();
    }

    @DeleteMapping("/supprimer/{id}")
    public void supprimerProfessionnel(@PathVariable Long id) {
        professionnelSanteService.supprimerProfessionnel(id);
    }
}
