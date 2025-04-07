package com.esprit.microservice.rendezvous.repositories;

import com.esprit.microservice.rendezvous.entities.ProfessionnelSante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfessionnelSanteRepository extends JpaRepository<ProfessionnelSante, Long> {
}
