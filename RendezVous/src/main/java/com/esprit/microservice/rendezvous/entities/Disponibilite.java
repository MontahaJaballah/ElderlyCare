package com.esprit.microservice.rendezvous.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalTime;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Disponibilite")
public class Disponibilite implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idDisponibilite")
    private long idDisponibilite;

    @ElementCollection(targetClass = JourSemaine.class)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "disponibilite_jours", joinColumns = @JoinColumn(name = "disponibilite_id"))
    @Column(name = "jour")
    private List<JourSemaine> jourSemaine;

    @Column(name = "heureDebut")
    private LocalTime heureDebut;

    @Column(name = "heureFin")
    private LocalTime heureFin;

    @ManyToOne
    @JsonIgnore
    private ProfessionnelSante professionnelSante;
}
