package com.esprit.microservice.rendezvous.repositories;

import com.esprit.microservice.rendezvous.entities.ProfessionnelSante;
import com.esprit.microservice.rendezvous.entities.Specialite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfessionnelSanteRepository extends JpaRepository<ProfessionnelSante, Long> {
    List<ProfessionnelSante> findBySpecialite(Specialite specialite);



}
