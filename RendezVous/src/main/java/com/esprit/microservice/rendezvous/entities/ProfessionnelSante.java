package com.esprit.microservice.rendezvous.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "ProfessionnelSante")
public class ProfessionnelSante implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idProfessionnelSante")
    private long idProfessionnelSante;

    @Column(name = "prenom")
    private String prenom;

    @Column(name = "nom")
    private String nom;

    @Enumerated(EnumType.STRING)
    @Column(name = "specialite")
    private Specialite specialite;

    @Column(name = "telephone")
    private String telephone;

    @Column(name = "email")
    private String email;

    @OneToMany(mappedBy = "professionnelSante", cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<RendezVous> rendezVous;

    @OneToMany(mappedBy = "professionnelSante", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Disponibilite> disponibilites;
}
