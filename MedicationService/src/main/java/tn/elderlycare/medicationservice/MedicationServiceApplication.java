package tn.elderlycare.medicationservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableDiscoveryClient
@EnableJpaRepositories(basePackages = "tn.elderlycare.medicationservice.repository")
@EntityScan(basePackages = "tn.elderlycare.medicationservice.entity")
@ComponentScan(basePackages = "tn.elderlycare.medicationservice")
public class MedicationServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(MedicationServiceApplication.class, args);
    }
}