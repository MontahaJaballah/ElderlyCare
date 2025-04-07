package com.example.gestionmedecin.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;


@Entity
@Table(name = "Medecin_Info")
@Getter
@Setter
public class Medecin implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "LAST_NAME")
    private String lastName;
    @Column(name = "FIRST_NAME")
    private String firstName;
    @Column(name ="ADRESSE")
    private String address;
    @Column(name = "TELEPHONE")
    private Integer telephone;
    @Column(name = "SPECIALTY")
    private String specialization;

}
