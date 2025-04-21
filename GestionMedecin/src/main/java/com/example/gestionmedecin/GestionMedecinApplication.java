package com.example.gestionmedecin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class GestionMedecinApplication {

	public static void main(String[] args) {
		SpringApplication.run(GestionMedecinApplication.class, args);
	}

}
