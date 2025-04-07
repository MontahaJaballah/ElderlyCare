package com.example.gestionmedecin.repositories;

import com.example.gestionmedecin.entities.Medecin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MedecinRepo extends JpaRepository<Medecin, Integer> {
    @Query("SELECT m FROM Medecin m WHERE m.firstName = :firstName AND m.lastName = :lastName AND m.specialization = :specialization")
    Medecin findByFirstNameAndLastNameAndSpecialization(
            @Param("firstName") String firstName,
            @Param("lastName") String lastName,
            @Param("specialization") String specialization
    );


    @Modifying
    @Query("DELETE FROM Medecin m WHERE m.firstName = :firstName AND m.lastName = :lastName")
    int deleteByFirstNameAndLastName(
            @Param("firstName") String firstName,
            @Param("lastName") String lastName
    );

}
