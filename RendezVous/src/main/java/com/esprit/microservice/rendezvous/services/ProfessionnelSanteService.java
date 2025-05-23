package com.esprit.microservice.rendezvous.services;

import com.esprit.microservice.rendezvous.entities.Disponibilite;
import com.esprit.microservice.rendezvous.entities.ProfessionnelSante;
import com.esprit.microservice.rendezvous.entities.Specialite;
import com.esprit.microservice.rendezvous.repositories.ProfessionnelSanteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfessionnelSanteService {
    private final ProfessionnelSanteRepository professionnelSanteRepository;

    public ProfessionnelSante ajouterProfessionnel(ProfessionnelSante professionnel) {
        if (professionnel.getDisponibilites() != null) {
            for (Disponibilite disponibilite : professionnel.getDisponibilites()) {
                disponibilite.setProfessionnelSante(professionnel);
            }
        }
        return professionnelSanteRepository.save(professionnel);
    }

    public List<ProfessionnelSante> getAllProfessionnels() {
        return professionnelSanteRepository.findAll();
    }

    public List<ProfessionnelSante> getProfessionnelsBySpecialite(String specialite) {
        return professionnelSanteRepository.findBySpecialite(Specialite.valueOf(specialite));
    }

    public void supprimerProfessionnel(Long id) {
        professionnelSanteRepository.deleteById(id);
    }
}

