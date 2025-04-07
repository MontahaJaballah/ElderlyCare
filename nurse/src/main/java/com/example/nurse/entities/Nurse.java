package com.example.nurse.entities;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;


@Getter
@Setter
@Entity
@Table(name = "Nurse")
public class Nurse implements Serializable {
  private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(name = "ID")
    private int id;
@Column(name = "ADRESS")
    private String address;
@Column(name = "NAME")
    private String name;
@Column (name = "YEARS_EXPERIENCE")
    private Integer years_experience;
@Column(name = "TELEPHONE_NUMBER")
    private Integer telephone_number;

}
