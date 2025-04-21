package com.example.gestionmedecin.services;

import com.example.gestionmedecin.entities.Medecin;
import com.example.gestionmedecin.repositories.MedecinRepo;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.util.List;
@Service
@Slf4j
@AllArgsConstructor
public class MedecinService implements IMedecin{
    MedecinRepo medecinRepo;

    @Override
    public List<Medecin> getMedecins() {
        return medecinRepo.findAll();
    }

    @Override
    public Medecin getMedecinByNameAndLastNameAndSpecialization(String medecinName, String lastName, String specialization) {
        return medecinRepo.findByFirstNameAndLastNameAndSpecialization(lastName, specialization, medecinName);
    }

    @Override
    public Medecin addMedecin(Medecin medecin) {
        return medecinRepo.save(medecin);
    }

    @Override
    public Medecin updateMedecin(Medecin medecin) {
        return medecinRepo.save(medecin);
    }

    @Override
    public void deleteMedecinbyId(Integer id) {
        medecinRepo.deleteById(id);
    }

    @Override
    @Transactional
    public void deleteMedecinByNameAndLastName(String medecinName, String lastName) {
        medecinRepo.deleteByFirstNameAndLastName(medecinName,lastName);
    }


}
