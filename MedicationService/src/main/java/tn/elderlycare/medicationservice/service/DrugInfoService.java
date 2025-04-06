package tn.elderlycare.medicationservice.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class DrugInfoService {
    private static final Logger logger = LoggerFactory.getLogger(DrugInfoService.class);
    private static final String OPENFDA_API_URL = "https://api.fda.gov/drug/label.json?search=openfda.brand_name:";

    private final RestTemplate restTemplate;

    public DrugInfoService() {
        this.restTemplate = new RestTemplate();
    }

    public String fetchDrugInfo(String drugName) {
        try {
            String url = OPENFDA_API_URL + drugName + "&limit=1";
            String response = restTemplate.getForObject(url, String.class);
            logger.info("Fetched drug info for {}: {}", drugName, response);
            return response != null ? response : "No drug information found";
        } catch (Exception e) {
            logger.error("Error fetching drug info for {}: {}", drugName, e.getMessage());
            return "Error fetching drug information: " + e.getMessage();
        }
    }
}