package com.esprit.microservice.rendezvous;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.scheduling.annotation.EnableScheduling;
import io.github.cdimascio.dotenv.Dotenv;


@SpringBootApplication
@EnableScheduling
@EnableDiscoveryClient
public class RendezVousApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.load(); // Loads the .env file

		System.setProperty("ACCOUNT_SID", dotenv.get("ACCOUNT_SID"));
		System.setProperty("AUTH_TOKEN", dotenv.get("AUTH_TOKEN"));
		System.setProperty("TWILIO_PHONE_NUMBER", dotenv.get("TWILIO_PHONE_NUMBER"));

		SpringApplication.run(RendezVousApplication.class, args);
	}

}
