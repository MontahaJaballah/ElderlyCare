package com.elderlycare.medicalequipment.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;
import org.springframework.core.env.Environment;

@Configuration
public class WeatherConfig {
    
    private final Environment environment;
    
    public WeatherConfig(Environment environment) {
        this.environment = environment;
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    public String getApiKey() {
        return environment.getProperty("OPENWEATHER_API_KEY");
    }
}
