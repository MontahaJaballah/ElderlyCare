package com.esprit.microservice.rendezvous.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "DossierMedical")
public class DossierMedical implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idDossierMedical")
    private long idDossierMedical;

    @ManyToOne
    private PersonneAgee personneAgee;

    @ManyToOne
    private ProfessionnelSante professionnelSante;

    @Column(name = "diagnostic")
    private String diagnostic;

    @Column(name = "prescription")
    private String prescription;

    @Column(name = "dateCreation")
    private LocalDateTime dateCreation;
}
