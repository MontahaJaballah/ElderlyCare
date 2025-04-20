
# **ElderlyCareHub**

## 🏥 About the Project
ElderlyCareHub is a platform designed to connect elderly individuals with healthcare professionals, enabling seamless management of medical needs, appointments, and social interactions.

## 🔹 Features
- **User Management** (Patients, Doctors, Nurses, Administrators)
- **Appointment Scheduling** for medical consultations
- **Medication Management** with reminders and notifications
- **Healthcare Staff Management** (Doctors, Nurses)
- **Medical Equipment Tracking**
- **QR Code Generation** for medication details with OpenFDA API integration

# Medication Service

## Overview
The Medication Service is a microservice built as part of the ElderlyCare system, a platform designed to manage healthcare services for elderly patients. This service is responsible for managing medications and reminders for patients, ensuring they adhere to their prescribed medication schedules. It integrates with external APIs (e.g., OpenFDA API) to fetch drug information and provides features like automatic reminder generation, email notifications, and QR code generation for medication tracking.

This service is built using **Spring Boot 3.4.4**, **Java 17**, and **Spring Data JPA** with an H2 in-memory database for persistence. It registers itself with a Eureka Server for service discovery in a microservices architecture.

## Key Features
- **Medication Management:** Add, update, delete, and retrieve medications for patients.
- **Reminder System:** Automatically generate reminders for medication doses based on frequency (e.g., "every 6 hours").
- **Overdue Reminder Notifications:** Send email notifications for overdue reminders.
- **Drug Information:** Fetch drug details from the OpenFDA API to provide additional information about medications.
- **Scheduled Reminder Checks:** Periodically check for overdue reminders and mark them as taken (runs every minute).
- **QR Code Generation:** Generate QR codes for each medication with encoded details (e.g., name, dosage, frequency, OpenFDA info).
- **Service Discovery:** Registers with Eureka Server for inter-service communication.

## 📱 QR Code Generation for Medication Details

### Overview
A unique QR code is generated for each medication entry, allowing caregivers and patients to quickly access medication details by scanning the QR code. The QR code includes the medication's ID, name, dosage, frequency, start date, patient ID, and additional drug information fetched from the [OpenFDA API](https://open.fda.gov/apis/drug/label/). This feature improves traceability and verification during medication administration.

### Endpoint
- **GET /medications/qr/{id}**
  - **Description**: Generates a QR code image for the medication with the specified `id`.
  - **Produces**: `image/png`
  - **Response**:
    - `200 OK`: Returns the QR code image as a `byte[]`.
    - `404 Not Found`: If the medication with the specified `id` does not exist.
    - `500 Internal Server Error`: If an error occurs during QR code generation.

### Implementation Details
- **Controller**: `MedicationController`
  - The `generateQrCode` method retrieves the medication details from the database, fetches additional drug information from the OpenFDA API, constructs the QR code content, and generates the QR code image using the `QrCodeService`.
- **Service**: `QrCodeService`
  - Uses the ZXing library to generate QR codes.
  - The `generateQrCode` method encodes the provided text into a QR code and returns it as a `byte[]` in PNG format.
- **Service**: `DrugInfoService`
  - Fetches drug information from the OpenFDA API using the medication name.
  - Parses the API response to extract relevant fields (e.g., indications and warnings) for inclusion in the QR code.

#### Dependencies
- **ZXing**: For QR code generation.
  ```xml
  <dependency>
      <groupId>com.google.zxing</groupId>
      <artifactId>core</artifactId>
      <version>3.5.3</version>
  </dependency>
  <dependency>
      <groupId>com.google.zxing</groupId>
      <artifactId>javase</artifactId>
      <version>3.5.3</version>
  </dependency>
  ```

### QR Code Content
Each QR code encodes the following information:
- Medication ID
- Name
- Dosage
- Frequency
- Start Date
- Patient ID
- OpenFDA Info (e.g., indications and warnings)

**Example**:
```
Medication ID: 1
Name: Ibuprofen
Dosage: 200mg
Frequency: every 6 hours
Start Date: 2025-04-06
Patient ID: 1
OpenFDA Info: Indications: [Truncated indications...]\nWarnings: [Truncated warnings...]
```

### Issue Encountered: Data Too Big for QR Code
During testing, the `GET /medications/qr/{id}` endpoint returned a `500 Internal Server Error` with the following log message:

```
2025-04-07T23:10:31.707+01:00 ERROR 10872 --- [medication-service] [nio-8082-exec-3] t.e.m.controller.MedicationController : Failed to generate QR code for medication ID: 1. Error: Data too big
```

- **Cause**: The QR code content (`qrContent`) exceeded the maximum data capacity for a QR code (approximately 4,296 alphanumeric characters). This was due to the large JSON response from the OpenFDA API being included in the QR code content without truncation.
- **Impact**: The ZXing library threw a `WriterException` with the message `Data too big`, resulting in a failed QR code generation.

### Solution
To resolve the issue, the following steps were taken:

1. **Truncated the OpenFDA API Response**:
   - Modified the `generateQrCode` method in `MedicationController` to truncate the `drugInfo` fetched from the OpenFDA API to 500 characters:
     ```java
     String truncatedDrugInfo = drugInfo != null && drugInfo.length() > 500 
         ? drugInfo.substring(0, 500) + "..." 
         : drugInfo;
     ```
   - Added a check to ensure the total `qrContent` length does not exceed 4,000 characters:
     ```java
     logger.debug("QR code content length: {}", qrContent.length());
     if (qrContent.length() > 4000) {
         logger.warn("QR code content is too long ({} characters). Truncating further.", qrContent.length());
         qrContent = qrContent.substring(0, 4000);
     }
     ```
2. **Added Logging for Debugging**:
   - Added `DEBUG` and `ERROR` logging statements in `MedicationController` to help diagnose the issue:
     ```java
     logger.debug("Generating QR code for medication ID: {}", id);
     logger.error("Failed to generate QR code for medication ID: {}. Error: {}", id, e.getMessage(), e);
     ```
   - Ensured the logging level was set to `DEBUG` in `application.properties`:
     ```properties
     logging.level.tn.elderlycare.medicationservice=DEBUG
     ```

## Prerequisites
Before running the Medication Service, ensure you have the following installed:
- **Java 17**
- **Maven 3.8.1+**
- **Eureka Server** (default URL: `http://localhost:8761/eureka/`)
- **Internet Access** (required for OpenFDA API)

## Project Structure
```
medication-service/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── tn/elderlycare/medicationservice/
│   │   │       ├── controller/
│   │   │       │   └── MedicationController.java
│   │   │       ├── dto/
│   │   │       ├── entity/
│   │   │       │   ├── Medication.java
│   │   │       │   └── Reminder.java
│   │   │       ├── exception/
│   │   │       ├── repository/
│   │   │       │   ├── MedicationRepository.java
│   │   │       │   └── ReminderRepository.java
│   │   │       ├── service/
│   │   │       │   ├── DrugInfoService.java
│   │   │       │   ├── MedicationService.java
│   │   │       │   ├── QrCodeService.java
│   │   │       │   └── ReminderService.java
│   │   │       ├── util/
│   │   │       └── MedicationServiceApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── pom.xml
└── README.md
```

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/medication-service.git
cd medication-service
```

### 2. Configure the Application
Edit `src/main/resources/application.properties` if needed. Default settings:

```properties
spring.application.name=medication-service
server.port=8082

spring.datasource.url=jdbc:h2:mem:medicationdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.open-in-view=false

eureka.client.enabled=true
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
eureka.client.register-with-eureka=true
eureka.client.fetch-registry=true
eureka.instance.prefer-ip-address=true

logging.level.org.springframework=INFO
logging.level.org.hibernate=INFO
logging.level.tn.elderlycare.medicationservice=DEBUG
```

**Note**: Ensure you have an active internet connection for the OpenFDA API to fetch drug information.

### 3. Build the Project
```bash
mvn clean install
```

### 4. Run the Application
```bash
mvn spring-boot:run
```

The service will start on port `8082` and attempt to register with Eureka Server at `http://localhost:8761`. If Eureka Server is not running, the service will still function but won't register.

### 5. Access the H2 Console (Optional)
- URL: `http://localhost:8082/h2-console`
- JDBC URL: `jdbc:h2:mem:medicationdb`
- Username: `sa`
- Password: *(leave empty)*

## Testing the Service

You can test the Medication Service using tools like Postman or curl. Below are some example requests:

### 1. Add a Medication
```bash
curl -X POST http://localhost:8082/medications \
-H "Content-Type: application/json" \
-d '{"patientId": 1, "name": "Ibuprofen", "dosage": "200mg", "frequency": "every 6 hours", "startDate": "2025-04-06"}'
```

### 2. Retrieve Medications for a Patient
```bash
curl http://localhost:8082/medications/patient/1
```

### 3. Generate a QR Code for a Medication
```bash
curl -o qr-code.png http://localhost:8082/medications/qr/1
```
- The `qr-code.png` file will contain the QR code image. Scan it to verify the medication details.

### 4. Check Overdue Reminders
- The service automatically checks for overdue reminders every minute and sends email notifications (if configured).
- You can also manually check reminders via the H2 console or by implementing a custom endpoint.
```






# **ElderlyCareHub - Medical Equipment Management**

## 🏥 About the Project
ElderlyCareHub's Medical Equipment module is a comprehensive system for tracking and managing medical equipment in healthcare facilities. It features real-time monitoring, maintenance tracking, weather alerts, and AI-powered assistance.

## 📋 Core Entities

### Medical Equipment
- **Fields**:
  - `id`: Unique identifier
  - `equipmentCode`: Unique code (format: EQ-{id})
  - `name`: Equipment name
  - `type`: Equipment type
  - `available`: Availability status
  - `manufactureDate`: Date of manufacture
  - `maintenanceRecords`: List of maintenance records

### Equipment Maintenance
- **Fields**:
  - `id`: Unique identifier
  - `description`: Maintenance description
  - `maintenanceDate`: Date of maintenance
  - `equipment`: Reference to associated equipment

## 🔌 API Endpoints

### Equipment Management

#### Basic CRUD Operations
```
GET    /api/equipment      # List all equipment
GET    /api/equipment/{id} # Get equipment by ID
POST   /api/equipment      # Create new equipment
PUT    /api/equipment/{id} # Update equipment
DELETE /api/equipment/{id} # Delete equipment
```

#### Special Features

##### 1. Weather Monitoring
```
GET /api/equipment/weather-monitoring?city={cityName}
```
- Monitors weather conditions for equipment locations
- Uses OpenWeather API for real-time weather data
- Sends email alerts for extreme conditions
- Configuration in `.env`:
  ```
  OPENWEATHER_API_KEY=your_key
  EMAIL_USERNAME=sender@email.com
  EMAIL_PASSWORD=your_password
  EMAIL_RECEIVER=receiver@email.com
  ```

##### 2. Equipment Age Monitoring
```
GET /api/equipment/flag-old
```
- Identifies equipment requiring maintenance based on age
- Flags items for inspection/replacement

##### 3. AI Assistant
```
GET /api/equipment/ask-ai
```
- AI-powered chatbot using Cohere API
- Assists with equipment-related queries
- Configuration: `COHERE_API_KEY` in `.env`

##### 4. PDF Report Generation
```
GET /api/equipment/generate-pdf/{id}
```
- Generates detailed PDF reports for equipment
- Features:
  - Equipment details
  - Maintenance history
  - Unique barcode (Code 128 format)
  - Professional formatting

##### 5. Barcode Scanning
```
GET /api/equipment/by-code/{code}
```
- Retrieve equipment details via barcode
- Format: EQ-{id} (e.g., EQ-3)
- Auto-generated for new equipment

##### 6. Stats
```
GET 
http://localhost:8090/equipment/api/stats/equipment/type-distribution
```
- Returns statistics on equipment usage and maintenance
- Includes:
  - Total equipment count
  - Average equipment age
  - Maintenance frequency

## 🛠 Technical Details

### Dependencies
```xml
<dependencies>
    <!-- Spring Boot -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- PDF Generation -->
    <dependency>
        <groupId>com.itextpdf</groupId>
        <artifactId>itextpdf</artifactId>
        <version>5.5.13.3</version>
    </dependency>
    
    <!-- Database -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- Stats Charts -->
    <dependency>
        <groupId>org.jfree</groupId>
        <artifactId>jfreechart</artifactId>
        <version>1.5.3</version>
    </dependency>
</dependencies>
```

### Entity Relationships
- One-to-Many relationship between Equipment and Maintenance
- Each equipment can have multiple maintenance records
- Maintenance records are cascade-deleted with equipment

### Security Features
- CORS enabled for cross-origin requests
- Environment variables for sensitive data
- Unique constraints on equipment codes

## 🚀 Getting Started

1. Clone the repository
2. Configure environment variables in `.env`
3. Import the project into IntelliJ IDEA
4. Run the application as a Spring Boot application
5. Access the API at `http://localhost:8090/equipment`
6. For microservices architecture, ensure each module is running separately and configured to communicate with each other.

## 📝 Notes
- Equipment codes are automatically generated as EQ-{id}
- PDF reports include scannable barcodes
- Weather monitoring runs on a scheduled basis
- AI chatbot requires valid Cohere API key

