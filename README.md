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
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
4. Access the API at `http://localhost:8090/equipment`

## 📝 Notes
- Equipment codes are automatically generated as EQ-{id}
- PDF reports include scannable barcodes
- Weather monitoring runs on a scheduled basis
- AI chatbot requires valid Cohere API key
