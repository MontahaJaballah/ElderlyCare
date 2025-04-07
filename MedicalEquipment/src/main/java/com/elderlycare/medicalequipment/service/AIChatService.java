package com.elderlycare.medicalequipment.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.*;

@Service
public class AIChatService {

    @Value("${cohere.api.key}")
    private String cohereApiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public AIChatService(@Qualifier("cohereRestTemplate") RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public String getAIResponse(String question) {
        String apiUrl = "https://api.cohere.ai/v1/chat";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(cohereApiKey);

        Map<String, Object> body = new HashMap<>();
        body.put("message", question);
        body.put("model", "command-r");
        body.put("temperature", 0.5);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.POST,
                request,
                String.class
            );
            Map<String, Object> responseBody = objectMapper.readValue(response.getBody(), Map.class);
            
            if (responseBody != null && responseBody.containsKey("text")) {
                return (String) responseBody.get("text");
            }
            return "⚠️ Error: Invalid response from AI service.";
        } catch (Exception e) {
            e.printStackTrace();
            return "⚠️ Error: Could not fetch AI response: " + e.getMessage();
        }
    }
}
