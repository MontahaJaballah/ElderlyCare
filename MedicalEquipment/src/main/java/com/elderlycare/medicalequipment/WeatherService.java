package com.elderlycare.medicalequipment;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.json.JSONObject;
import com.elderlycare.medicalequipment.config.WeatherConfig;
import com.elderlycare.medicalequipment.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class WeatherService {
    
    private static final Logger logger = LoggerFactory.getLogger(WeatherService.class);

    private final WeatherConfig weatherConfig;
    private final RestTemplate restTemplate;
    private final EmailService emailService;
    private static final String WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

    public WeatherService(WeatherConfig weatherConfig, RestTemplate restTemplate, EmailService emailService) {
        this.weatherConfig = weatherConfig;
        this.restTemplate = restTemplate;
        this.emailService = emailService;
    }

    public WeatherResponse getWeatherRisk(String city) {
        try {
            String url = WEATHER_API_URL + "?q=" + city + "&appid=" + weatherConfig.getApiKey() + "&units=metric";
            String json = restTemplate.getForObject(url, String.class);

            JSONObject obj = new JSONObject(json);
            double temperature = obj.getJSONObject("main").getDouble("temp");
            int humidity = obj.getJSONObject("main").getInt("humidity");

            String risk = evaluateRisk(city, temperature, humidity);
            WeatherResponse response = new WeatherResponse(city, temperature, humidity, risk);

            // Send email alert if conditions are risky
            if (!risk.contains("Safe")) {
                try {
                    emailService.sendRiskAlertEmail("Medical Equipment in " + city, risk);
                    logger.info("Email alert sent successfully for equipment in {}", city);
                } catch (Exception e) {
                    // Log the error but don't let it affect the response
                    logger.error("Failed to send email alert: {}", e.getMessage());
                }
            }

            return response;
        } catch (Exception e) {
            logger.error("Error getting weather data for {}: {}", city, e.getMessage());
            throw new RuntimeException("Failed to get weather data for " + city);
        }
    }

    private String evaluateRisk(String city, double temp, int humidity) {
        String riskStatus;
        if (humidity > 80 && temp < 5) {
            riskStatus = "⚠️ Risky for sensitive equipment (High humidity and low temperature)";
        } else if (humidity > 80) {
            riskStatus = "⚠️ Risky: Humidity too high";
        } else if (temp < 0) {
            riskStatus = "❄️ Risky: Freezing temperature";
        } else {
            riskStatus = "✅ Safe for equipment";
        }

        if (!riskStatus.contains("Safe")) {
            logger.warn("Risk detected for equipment in {}: {}", city, riskStatus);
        }

        return riskStatus;
    }
}
