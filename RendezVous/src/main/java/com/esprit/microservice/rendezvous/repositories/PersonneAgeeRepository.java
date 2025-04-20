package com.esprit.microservice.rendezvous.repositories;

import com.esprit.microservice.rendezvous.entities.PersonneAgee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonneAgeeRepository extends JpaRepository<PersonneAgee, Long> {
}

