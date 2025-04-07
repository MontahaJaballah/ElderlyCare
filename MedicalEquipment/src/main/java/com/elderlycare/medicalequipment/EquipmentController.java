package com.elderlycare.medicalequipment;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

import com.elderlycare.medicalequipment.dto.ChatRequestDTO;
import com.elderlycare.medicalequipment.service.AIChatService;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {

    private final EquipmentService equipmentService;
    private final WeatherService weatherService;
    private final AIChatService aiChatService;

    public EquipmentController(EquipmentService equipmentService, WeatherService weatherService, AIChatService aiChatService) {
        this.equipmentService = equipmentService;
        this.weatherService = weatherService;
        this.aiChatService = aiChatService;
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
    @GetMapping("/weather-monitoring")
    public WeatherResponse monitorWeather(@RequestParam String city) {
        return weatherService.getWeatherRisk(city);
    }

    // Equipment flagging endpoint
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
}
