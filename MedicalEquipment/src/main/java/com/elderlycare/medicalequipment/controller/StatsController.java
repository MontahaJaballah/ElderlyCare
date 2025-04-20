package com.elderlycare.medicalequipment.controller;

import com.elderlycare.medicalequipment.MedicalEquipment;
import com.elderlycare.medicalequipment.MedicalEquipmentRepository;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartUtils;
import org.jfree.chart.JFreeChart;
import org.jfree.data.general.DefaultPieDataset;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final MedicalEquipmentRepository equipmentRepository;

    public StatsController(MedicalEquipmentRepository equipmentRepository) {
        this.equipmentRepository = equipmentRepository;
    }

    @GetMapping(value = "/equipment/availability", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getEquipmentAvailabilityChart() throws Exception {
        // Get counts from repository
        long available = equipmentRepository.countByAvailable(true);
        long notAvailable = equipmentRepository.countByAvailable(false);

        // Create dataset
        DefaultPieDataset<String> dataset = new DefaultPieDataset<>();
        dataset.setValue("Available", available);
        dataset.setValue("Not Available", notAvailable);

        // Create chart
        JFreeChart chart = ChartFactory.createPieChart(
                "Medical Equipment Availability",  // chart title
                dataset,                          // data
                true,                            // include legend
                true,                            // tooltips
                false                            // URLs
        );

        // Convert to PNG
        BufferedImage chartImage = chart.createBufferedImage(600, 400);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ChartUtils.writeBufferedImageAsPNG(baos, chartImage);

        // Return PNG image
        return ResponseEntity
                .ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(baos.toByteArray());
    }

    @GetMapping(value = "/equipment/type-distribution", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getEquipmentTypeDistributionChart() throws Exception {
        // Create dataset
        DefaultPieDataset<String> dataset = new DefaultPieDataset<>();
        
        // Get equipment counts by type
        equipmentRepository.findAll().stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        MedicalEquipment::getType,
                        java.util.stream.Collectors.counting()
                ))
                .forEach(dataset::setValue);

        // Create chart
        JFreeChart chart = ChartFactory.createPieChart(
                "Equipment Type Distribution",
                dataset,
                true,
                true,
                false
        );

        // Convert to PNG
        BufferedImage chartImage = chart.createBufferedImage(600, 400);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ChartUtils.writeBufferedImageAsPNG(baos, chartImage);

        return ResponseEntity
                .ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(baos.toByteArray());
    }
}
