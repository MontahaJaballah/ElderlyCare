package com.esprit.microservice.rendezvous.controller;

import com.esprit.microservice.rendezvous.entities.PersonneAgee;
import com.esprit.microservice.rendezvous.services.PersonneAgeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/personnes")
@RequiredArgsConstructor
public class PersonneAgeeController {
    private final PersonneAgeeService personneAgeeService;

    @PostMapping("/ajouter")
    public PersonneAgee ajouterPersonne(@RequestBody PersonneAgee personne) {
        return personneAgeeService.ajouterPersonne(personne);
    }

    @GetMapping("/all")
    public List<PersonneAgee> getAllPersonnes() {
        return personneAgeeService.getAllPersonnes();
    }

    @DeleteMapping("/supprimer/{id}")
    public void supprimerPersonne(@PathVariable Long id) {
        personneAgeeService.supprimerPersonne(id);
    }
}
