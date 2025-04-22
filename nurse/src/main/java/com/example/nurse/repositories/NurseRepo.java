package com.example.nurse.repositories;


import com.example.nurse.entities.Nurse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Repository
public interface NurseRepo extends JpaRepository<Nurse, Integer> {

    // Requête JPQL personnalisée pour trouver par nom
    @Query("SELECT n FROM Nurse n WHERE n.name LIKE %:name%")
    List<Nurse> searchByName(@Param("name") String name);


    // Requête JPQL pour filtrer par années d'expérience
    @Query("SELECT n FROM Nurse n WHERE n.years_experience >= :minYears")
    List<Nurse> findByMinExperience(@Param("minYears") int minYears);



}
