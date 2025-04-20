package com.esprit.microservice.rendezvous.entities;

import com.esprit.microservice.rendezvous.entities.PersonneAgee;
import com.esprit.microservice.rendezvous.entities.ProfessionnelSante;
import com.esprit.microservice.rendezvous.entities.StatutRendezVous;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "RendezVous")
public class RendezVous implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idRendezVous")
    private long idRendezVous;

    @Column(name = "dateHeure")
    private LocalDateTime dateHeure;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut")
    private StatutRendezVous statut;

    @ManyToOne
    @JsonIgnore
    private PersonneAgee personneAgee;

    @ManyToOne
    @JsonIgnore
    private ProfessionnelSante professionnelSante;

    @Column(name = "remarques")
    private String remarques;
}
