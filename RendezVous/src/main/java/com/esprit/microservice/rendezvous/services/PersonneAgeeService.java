package com.esprit.microservice.rendezvous.services;

import com.esprit.microservice.rendezvous.entities.PersonneAgee;
import com.esprit.microservice.rendezvous.repositories.PersonneAgeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PersonneAgeeService {
    private final PersonneAgeeRepository personneAgeeRepository;

    public PersonneAgee ajouterPersonne(PersonneAgee personne) {
        return personneAgeeRepository.save(personne);
    }

    public List<PersonneAgee> getAllPersonnes() {
        return personneAgeeRepository.findAll();
    }

    public void supprimerPersonne(Long id) {
        personneAgeeRepository.deleteById(id);
    }
}
