# **ElderlyCareHub**  

## 🏥 About the Project  
ElderlyCareHub is a platform designed to connect elderly individuals with healthcare professionals, enabling seamless management of medical needs, appointments, and social interactions.  

## 🔹 Features  
- **User Management** (Patients, Doctors, Nurses, Administrators)  
- **Appointment Scheduling** for medical consultations  
- **Medication Management** and reminders  
- **Healthcare Staff Management** (Doctors, Nurses)  
- **Medical Equipment Tracking**
  # Medication Service<br><br>

## Overview<br>
The Medication Service is a microservice built as part of the ElderlyCare system, a platform designed to manage healthcare services for elderly patients.<br>
This service is responsible for managing medications and reminders for patients, ensuring they adhere to their prescribed medication schedules.<br>
It integrates with external APIs (e.g., OpenFDA API) to fetch drug information and provides features like automatic reminder generation and medication management.<br><br>

This service is built using Spring Boot 3.4.4, Java 17, and Spring Data JPA with an H2 in-memory database for persistence.<br>
It registers itself with a Eureka Server for service discovery in a microservices architecture.<br><br>

## Key Features<br>
- **Medication Management:** Add, update, delete, and retrieve medications for patients.<br>
- **Reminder System:** Automatically generate reminders for medication doses based on frequency (e.g., "every 6 hours").<br>
- **Drug Information:** Fetch drug details from the OpenFDA API to provide additional information about medications.<br>
- **Scheduled Reminder Checks:** Periodically check for overdue reminders and mark them as taken (runs every minute).<br>
- **Service Discovery:** Registers with Eureka Server for inter-service communication.<br><br>

## Prerequisites<br>
Before running the Medication Service, ensure you have the following installed:<br>
- **Java 17**<br>
- **Maven 3.8.1+**<br>
- **Eureka Server** (default URL: `http://localhost:8761/eureka/`)<br>
- **Internet Access** (required for OpenFDA API)<br><br>

## Project Structure<br>
medication-service/<br> ├── src/<br> │   ├── main/<br> │   │   ├── java/<br> │   │   │   └── tn/elderlycare/medicationservice/<br> │   │   │   ├── controller/<br> │   │   │   ├── dto/<br> │   │   │   ├── entity/<br> │   │   │   ├── exception/<br> │   │   │   ├── repository/<br> │   │   │   ├── service/<br> │   │   │   ├── util/<br> │   │   │   └── MedicationServiceApplication.java<br> │   └── resources/<br> │   └── application.properties<br> ├── pom.xml<br> └── README.md<br>
<br>

## Setup Instructions<br>

### 1. Clone the Repository
<br>git clone https://github.com/<your-username>/medication-service.git<br>
<br>cd medication-service<br>
### 2. Configure the Application<br>
Edit `src/main/resources/application.properties` if needed. Default settings:<br>

properties<br>
spring.application.name=medication-service<br>
server.port=8082<br>

spring.datasource.url=jdbc:h2:mem:medicationdb<br>
spring.datasource.driverClassName=org.h2.Driver<br>
spring.datasource.username=sa<br>
spring.datasource.password=<br>
spring.h2.console.enabled=true<br>
spring.h2.console.path=/h2-console<br>

spring.jpa.hibernate.ddl-auto=update<br>
spring.jpa.show-sql=true<br>
spring.jpa.open-in-view=false<br>

eureka.client.enabled=true<br>
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/<br>
eureka.client.register-with-eureka=true<br>
eureka.client.fetch-registry=true<br>
eureka.instance.prefer-ip-address=true<br>

logging.level.org.springframework=INFO<br>
logging.level.org.hibernate=INFO<br>
logging.level.tn.elderlycare.medicationservice=DEBUG<br>
<br><br>

### 3. Build the Project<br>
<br>
mvn clean install<br>
<br>

### 4. Run the Application<br>
<br>
mvn spring-boot:run<br>
<br>
The service will start on port `8082` and register with Eureka Server at `http://localhost:8761`.<br><br>

### 5. Access the H2 Console (Optional)<br>
- URL: `http://localhost:8082/h2-console`<br>
- JDBC URL: `jdbc:h2:mem:medicationdb`<br>
- Username: `sa`<br>
- Password: *(leave empty)*<br><br>

## API Documentation<br>

### Base URL<br>
http://localhost:8082<br>

### Medication Endpoints<br>
| Method | Endpoint | Description | Example Request Body | Example Response |
|--------|----------|-------------|----------------------|------------------|
| POST | /medications | Add a medication |
json
{
  "patientId": 1,
  "name": "Ibuprofen",
  "dosage": "200mg",
  "frequency": "every 6 hours",
  "startDate": "2025-04-04"
}
| Response includes medication with generated reminders.

| GET | /medications/patient/{patientId} | Retrieve medications for a patient | N/A | List of medications |
| PUT | /medications/{medicationId} | Update a medication | JSON with updated fields | Updated medication object |
| DELETE | /medications/{medicationId} | Delete a medication | N/A | `"Medication deleted successfully"` |
| GET | /medications/test | Test endpoint | N/A | `"Test endpoint is working!"` |

### Reminder Endpoints
| Method | Endpoint | Description | Example Request Body | Example Response |
|--------|----------|-------------|----------------------|------------------|
| POST | /reminders/medication/{medicationId} | Add a reminder |
json
{ "reminderTime": "2025-04-04T08:00:00" }
| Reminder object |
| GET | /reminders/patient/{patientId} | Get reminders for patient | N/A | List of reminders |
| GET | /reminders/all | Get all reminders | N/A | List of reminders |

## Example Usage<br>

### Add a Medication<br>
bash<br>
curl -X POST http://localhost:8082/medications \<br>
-H "Content-Type: application/json" \<br>
-d '{"patientId": 1, "name": "Ibuprofen", "dosage": "200mg", "frequency": "every 6 hours", "startDate": "2025-04-04"}'<br>
<br>

### Retrieve Medications<br>
bash<br>
curl http://localhost:8082/medications/patient/1<br>
<br>

### Retrieve Reminders<br>
bash<br>
curl http://localhost:8082/reminders/patient/1<br>
<br><br>

## Value-Added Features<br>

**OpenFDA Integration**<br>
- Fetches drug info (side effects, warnings, etc.)<br>
- Logs detailed drug data<br><br>

**Automatic Reminder Generation**<br>
- Based on frequency (e.g., "every 6 hours")<br>
- Generates next 3 doses starting at 8 AM of startDate<br><br>

**Scheduled Checks**<br>
- Runs every minute<br>
- Marks overdue reminders as taken<br><br>

## Troubleshooting<br>

**Eureka Not Found:**<br>
- Check if Eureka is running at `http://localhost:8761/eureka/`<br>
- Confirm URL in `application.properties`<br><br>

**H2 Console Not Accessible:**<br>
- Ensure `spring.h2.console.enabled=true`<br>
- Use correct JDBC URL: `jdbc:h2:mem:medicationdb`<br><br>

**OpenFDA Errors:**<br>
- Service logs any API failures<br><br>

## Logs<br>
Log levels (console):<br>
- org.springframework: INFO<br>
- org.hibernate: INFO<br>
- tn.elderlycare.medicationservice: DEBUG<br><br>

To increase verbosity, adjust log levels in `application.properties`.<br>
