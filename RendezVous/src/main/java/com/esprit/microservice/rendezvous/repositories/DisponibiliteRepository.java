package com.esprit.microservice.rendezvous.repositories;

import com.esprit.microservice.rendezvous.entities.Disponibilite;
import com.esprit.microservice.rendezvous.entities.JourSemaine;
import com.esprit.microservice.rendezvous.entities.ProfessionnelSante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;

@Repository
public interface DisponibiliteRepository extends JpaRepository<Disponibilite, Long> {
    boolean existsByProfessionnelSanteAndJourSemaineAndHeureDebutLessThanEqualAndHeureFinGreaterThanEqual(
            ProfessionnelSante professionnelSante, JourSemaine jourSemaine, LocalTime heureDebut, LocalTime heureFin
    );
}
