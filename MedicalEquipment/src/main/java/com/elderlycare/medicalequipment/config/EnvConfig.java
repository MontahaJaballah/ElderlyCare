package com.elderlycare.medicalequipment.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.io.FileSystemResource;

import java.io.File;

@Configuration
public class EnvConfig {

    @Bean
    public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
        PropertySourcesPlaceholderConfigurer configurer = new PropertySourcesPlaceholderConfigurer();
        
        // Look for .env file in the project root directory
        File envFile = new File(".env");
        if (envFile.exists()) {
            configurer.setLocation(new FileSystemResource(envFile));
        }
        
        return configurer;
    }
}
