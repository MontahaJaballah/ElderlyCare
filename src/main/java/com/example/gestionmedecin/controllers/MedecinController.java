package com.example.gestionmedecin.controllers;

import com.example.gestionmedecin.entities.Medecin;
import com.example.gestionmedecin.services.IMedecin;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;



@RestController
@AllArgsConstructor
@RequestMapping("/")


public class MedecinController {
    IMedecin iMedecin;

    @GetMapping("/getMedecins")
    public List<Medecin> getMedecins() {
        return iMedecin.getMedecins();
    }

    @GetMapping("/getMedecinByNameAndLastNameAndSpecialization")
    public Medecin getMedecinByNameAndLastNameAndSpecialization(@RequestParam("first_name") String medecinName, @RequestParam("last_name") String lastName, @RequestParam("specialization") String specialization) {
        return iMedecin.getMedecinByNameAndLastNameAndSpecialization(medecinName, lastName, specialization);
    }


    @PostMapping("/addMedecin")
    public Medecin addMedecin(@RequestBody Medecin medecin) {
        return iMedecin.addMedecin(medecin);
    }

    @PutMapping("/updateMedecin")
    public Medecin updateMedecin(@RequestBody Medecin medecin) {
        return iMedecin.updateMedecin(medecin);
    }
    @DeleteMapping("/deleteMedecin/{medecinId}")
    public void deleteMedecin(@PathVariable("medecinId")  Integer medecinId) {
        iMedecin.deleteMedecinbyId(medecinId);
    }

    @DeleteMapping("/deleteMedecinByNameAndLastName")
    public void deleteMedecinByNameAndLastName(@RequestParam("medecin_Name") String medecinName,@RequestParam("last_Name") String lastName) {
        iMedecin.deleteMedecinByNameAndLastName(medecinName, lastName);
    }


}
