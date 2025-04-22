package com.elderlycare.medicalequipment;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import org.springframework.core.io.InputStreamResource;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.io.ByteArrayInputStream;

import com.elderlycare.medicalequipment.dto.ChatRequestDTO;
import com.elderlycare.medicalequipment.service.AIChatService;
import com.elderlycare.medicalequipment.service.PDFService;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {

    private final EquipmentService equipmentService;
    private final WeatherService weatherService;
    private final AIChatService aiChatService;
    private final PDFService pdfService;

    public EquipmentController(EquipmentService equipmentService, WeatherService weatherService,
                              AIChatService aiChatService, PDFService pdfService) {
        this.equipmentService = equipmentService;
        this.weatherService = weatherService;
        this.aiChatService = aiChatService;
        this.pdfService = pdfService;
    }

    // MedicalEquipment endpoints
    @PostMapping("/add")
    public MedicalEquipment addEquipment(@RequestBody MedicalEquipment equipment) {
        return equipmentService.addEquipment(equipment);
    }

    @GetMapping("/all")
    public List<MedicalEquipment> getAllEquipment() {
        return equipmentService.getAllEquipment();
    }

    @DeleteMapping("/delete/{id}")
    public void deleteEquipment(@PathVariable int id) {
        equipmentService.deleteEquipment(id);
    }

    // EquipmentMaintenance endpoints
    @PostMapping("/maintenance/add")
    public EquipmentMaintenance addMaintenance(@RequestBody EquipmentMaintenance maintenance) {
        return equipmentService.addMaintenance(maintenance);
    }

    @GetMapping("/maintenance/all")
    public List<EquipmentMaintenance> getAllMaintenance() {
        return equipmentService.getAllMaintenance();
    }

    @DeleteMapping("/maintenance/delete/{id}")
    public void deleteMaintenance(@PathVariable int id) {
        equipmentService.deleteMaintenance(id);
    }

    // Weather monitoring endpoint
    @PreAuthorize("hasRole('equip_admin')")
    @GetMapping("/weather-monitoring")
    public WeatherResponse monitorWeather(@RequestParam String city) {
        return weatherService.getWeatherRisk(city);
    }

    // Equipment flagging endpoint
    @PreAuthorize("hasRole('equip_admin')")
    @GetMapping("/flag-old")
    public List<Map<String, Object>> getFlaggedOldEquipment() {
        return equipmentService.getFlaggedOldEquipment();
    }

    // AI Chat endpoint
    @PostMapping("/ask-ai")
    public ResponseEntity<Map<String, String>> askAI(@RequestBody ChatRequestDTO chatRequest) {
        String question = chatRequest.getQuestion();
        String answer = aiChatService.getAIResponse(question);

        Map<String, String> response = new HashMap<>();
        response.put("answer", answer);
        return ResponseEntity.ok(response);
    }

    // PDF Generation endpoint
    @GetMapping("/generate-pdf/{id}")
    public ResponseEntity<InputStreamResource> generatePDF(@PathVariable("id") int id) {
        try {
            ByteArrayInputStream bis = pdfService.generateEquipmentPDF(id);
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "inline; filename=equipment_details.pdf");

            return ResponseEntity
                    .ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(new InputStreamResource(bis));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
