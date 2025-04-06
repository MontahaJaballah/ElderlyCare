package com.elderlycare.medicalequipment;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.json.JSONObject;

@Service
public class WeatherService {

    @Value("${openweather.api.key}")
    private String apiKey;

    private static final String WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

    public WeatherResponse getWeatherRisk(String city) {
        RestTemplate restTemplate = new RestTemplate();

        String url = WEATHER_API_URL + "?q=" + city + "&appid=" + apiKey + "&units=metric";
        String json = restTemplate.getForObject(url, String.class);

        JSONObject obj = new JSONObject(json);
        double temperature = obj.getJSONObject("main").getDouble("temp");
        int humidity = obj.getJSONObject("main").getInt("humidity");

        String risk = evaluateRisk(temperature, humidity);

        return new WeatherResponse(city, temperature, humidity, risk);
    }

    private String evaluateRisk(double temp, int humidity) {
        if (humidity > 80 && temp < 5) {
            return "⚠️ Risky for sensitive equipment (High humidity and low temperature)";
        } else if (humidity > 80) {
            return "⚠️ Risky: Humidity too high";
        } else if (temp < 0) {
            return "❄️ Risky: Freezing temperature";
        } else {
            return "✅ Safe for equipment";
        }
    }
}
