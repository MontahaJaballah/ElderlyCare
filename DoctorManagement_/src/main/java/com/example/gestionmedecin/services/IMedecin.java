package com.example.gestionmedecin.services;

import com.example.gestionmedecin.entities.Medecin;

import java.util.List;

public interface IMedecin {
    List<Medecin> getMedecins();
    Medecin getMedecinByNameAndLastNameAndSpecialization(String medecinName, String lastName, String specialization);
    Medecin addMedecin(Medecin medecin);
    Medecin updateMedecin(Medecin medecin);
    void deleteMedecinbyId(Integer id);
    void deleteMedecinByNameAndLastName(String medecinName, String lastName);
}
