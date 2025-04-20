package com.elderlycare.medicalequipment.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.itextpdf.text.pdf.Barcode128;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import com.elderlycare.medicalequipment.EquipmentMaintenance;
import com.elderlycare.medicalequipment.MedicalEquipment;
import com.elderlycare.medicalequipment.MedicalEquipmentRepository;
import com.elderlycare.medicalequipment.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PDFService {

    private final MedicalEquipmentRepository equipmentRepository;

    public PDFService(MedicalEquipmentRepository equipmentRepository) {
        this.equipmentRepository = equipmentRepository;
    }

    public ByteArrayInputStream generateEquipmentPDF(int equipmentId) throws Exception {
        // Fetch equipment from database
        MedicalEquipment equipment = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment not found with id: " + equipmentId));

        // Setup document
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 50, 50, 50, 50);
        PdfWriter writer = PdfWriter.getInstance(document, out);

        // Add metadata and document properties
        document.addAuthor("ElderlyCare Medical System");
        document.addCreator("Medical Equipment Management System");
        document.addTitle("Equipment Details Report - " + equipment.getName());
        document.addKeywords("medical equipment, healthcare, maintenance, " + equipment.getType());
        document.addSubject("Medical Equipment Details and Maintenance History");

        document.open();

        // Header with Logo (you can replace this with an actual logo)
        Font titleFont = new Font(Font.FontFamily.HELVETICA, 24, Font.BOLD, new BaseColor(0, 102, 204));
        Font subtitleFont = new Font(Font.FontFamily.HELVETICA, 14, Font.ITALIC, new BaseColor(128, 128, 128));
        
        Paragraph title = new Paragraph();
        title.add(new Chunk("Equipment Details Report\n", titleFont));
        title.add(new Chunk("Generated on: " + LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy")), subtitleFont));
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(30);
        document.add(title);
        
        // Add horizontal line
        Paragraph line = new Paragraph();
        line.add(new Chunk("_").setUnderline(0.1f, -2f));
        line.setAlignment(Element.ALIGN_CENTER);
        document.add(line);
        document.add(new Paragraph("\n"));

        // Equipment Information Section
        Font sectionFont = new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD, new BaseColor(0, 102, 204));
        Font labelFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, new BaseColor(64, 64, 64));
        Font valueFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL, BaseColor.BLACK);
        
        Paragraph equipmentSection = new Paragraph("Equipment Information", sectionFont);
        equipmentSection.setSpacingBefore(20);
        equipmentSection.setSpacingAfter(10);
        document.add(equipmentSection);
        
        // Create a table for equipment details
        PdfPTable detailsTable = new PdfPTable(2);
        detailsTable.setWidthPercentage(100);
        detailsTable.setWidths(new float[]{1, 2});
        detailsTable.setSpacingBefore(10);
        detailsTable.setSpacingAfter(10);
        
        // Add equipment details in table format
        addTableRow(detailsTable, "Equipment Name:", equipment.getName(), labelFont, valueFont);
        addTableRow(detailsTable, "Type:", equipment.getType(), labelFont, valueFont);
        addTableRow(detailsTable, "Status:", equipment.isAvailable() ? 
            "Available ✓" : "Not Available ✗", labelFont, 
            new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL, 
                equipment.isAvailable() ? new BaseColor(0, 150, 0) : new BaseColor(200, 0, 0)));
        
        if (equipment.getManufactureDate() != null) {
            addTableRow(detailsTable, "Manufacture Date:", 
                equipment.getManufactureDate().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy")), 
                labelFont, valueFont);
        }
        
        document.add(detailsTable);
        document.add(new Paragraph("\n"));

        // Maintenance Records Section
        if (equipment.getMaintenanceRecords() != null && !equipment.getMaintenanceRecords().isEmpty()) {
            Paragraph maintenanceSection = new Paragraph("Maintenance History", sectionFont);
            maintenanceSection.setSpacingBefore(20);
            maintenanceSection.setSpacingAfter(10);
            document.add(maintenanceSection);
            
            // Add a note about maintenance
            Font noteFont = new Font(Font.FontFamily.HELVETICA, 10, Font.ITALIC, new BaseColor(128, 128, 128));
            Paragraph note = new Paragraph("Below is the complete maintenance history for this equipment.", noteFont);
            note.setSpacingAfter(10);
            document.add(note);

            PdfPTable maintenanceTable = new PdfPTable(3);
            maintenanceTable.setWidthPercentage(100);
            maintenanceTable.setSpacingBefore(10f);
            maintenanceTable.setSpacingAfter(10f);

            // Set column widths
            float[] columnWidths = {1f, 3f, 2f};
            maintenanceTable.setWidths(columnWidths);

            // Style the table
            maintenanceTable.setHeaderRows(1);
            maintenanceTable.setKeepTogether(true);
            maintenanceTable.getDefaultCell().setPadding(8);
            maintenanceTable.getDefaultCell().setBorderColor(new BaseColor(200, 200, 200));

            // Add table headers
            addMaintenanceTableHeader(maintenanceTable);

            // Add maintenance records with alternating colors
            boolean isAlternate = false;
            for (EquipmentMaintenance record : equipment.getMaintenanceRecords()) {
                BaseColor rowColor = isAlternate ? new BaseColor(240, 240, 250) : BaseColor.WHITE;
                
                PdfPCell idCell = new PdfPCell(new Phrase(String.valueOf(record.getId()), valueFont));
                PdfPCell descCell = new PdfPCell(new Phrase(record.getDescription(), valueFont));
                PdfPCell dateCell = new PdfPCell(new Phrase(
                    record.getMaintenanceDate().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")), valueFont));
                
                styleCell(idCell, rowColor);
                styleCell(descCell, rowColor);
                styleCell(dateCell, rowColor);
                
                maintenanceTable.addCell(idCell);
                maintenanceTable.addCell(descCell);
                maintenanceTable.addCell(dateCell);
                
                isAlternate = !isAlternate;
            }

            document.add(maintenanceTable);
        }

        // Add barcode at the bottom
        PdfContentByte cb = writer.getDirectContent();
        Barcode128 barcode = new Barcode128();
        barcode.setCode("EQ-" + equipment.getId());
        barcode.setCodeType(Barcode.CODE128);
        Image barcodeImage = barcode.createImageWithBarcode(cb, null, null);
        
        // Resize and position barcode
        barcodeImage.scalePercent(150);
        barcodeImage.setAlignment(Element.ALIGN_CENTER);
        
        // Add a label for the barcode
        Paragraph barcodeSection = new Paragraph();
        barcodeSection.setSpacingBefore(30);
        barcodeSection.setSpacingAfter(10);
        barcodeSection.setAlignment(Element.ALIGN_CENTER);
        
        Font barcodeLabel = new Font(Font.FontFamily.HELVETICA, 10, Font.ITALIC, new BaseColor(128, 128, 128));
        barcodeSection.add(new Chunk("Equipment ID: EQ-" + equipment.getId(), barcodeLabel));
        
        document.add(barcodeSection);
        document.add(barcodeImage);
        
        // Footer
        Paragraph footer = new Paragraph("\n\nGenerated by ElderlyCare Medical Equipment System", 
            new Font(Font.FontFamily.HELVETICA, 10, Font.ITALIC));
        footer.setAlignment(Element.ALIGN_CENTER);
        document.add(footer);

        document.close();
        return new ByteArrayInputStream(out.toByteArray());
    }

    private void addMaintenanceTableHeader(PdfPTable table) {
        Font headerFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, BaseColor.WHITE);
        BaseColor headerColor = new BaseColor(0, 102, 204);

        String[] headers = {"Record ID", "Description", "Date"};
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
            cell.setBackgroundColor(headerColor);
            cell.setPadding(10);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            table.addCell(cell);
        }
    }

    private void addTableRow(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, labelFont));
        PdfPCell valueCell = new PdfPCell(new Phrase(value, valueFont));
        
        labelCell.setPadding(8);
        valueCell.setPadding(8);
        
        labelCell.setBorderColor(new BaseColor(200, 200, 200));
        valueCell.setBorderColor(new BaseColor(200, 200, 200));
        
        table.addCell(labelCell);
        table.addCell(valueCell);
    }

    private void styleCell(PdfPCell cell, BaseColor backgroundColor) {
        cell.setBackgroundColor(backgroundColor);
        cell.setPadding(8);
        cell.setBorderColor(new BaseColor(200, 200, 200));
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
    }
}
