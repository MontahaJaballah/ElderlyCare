# **ElderlyCareHub**  

## 🏥 About the Project  
**ElderlyCareHub** is a platform designed to connect elderly individuals with healthcare professionals, enabling seamless management of medical needs, appointments, and social interactions.  

## 🔹 Features  
- **User Management** (Patients, Doctors, Nurses, Administrators)  
- **Appointment Scheduling** for medical consultations  
- **Medication Management** and reminders  
- **Healthcare Staff Management** (Doctors, Nurses)  
- **Medical Equipment Tracking**  

---

## 📅 Appointment Management System

The **Appointment Management System** is a core component of the **ElderlyCareHub** project. It handles the scheduling of appointments between elderly patients and healthcare professionals, sending reminders (via SMS and email), and managing appointment statuses. The system also integrates with a video consultation platform (Jitsi) to facilitate virtual appointments.

This component provides a set of **RESTful APIs** to manage appointments, send reminders, and create video consultations.

### 🔹 Features
- **Appointment Scheduling:** Allows the creation and management of appointments.
- **Appointment Reminders:** Sends SMS and email reminders for upcoming appointments.
- **Video Consultation Links:** Creates links for virtual appointments via Jitsi.
- **Real-Time Updates:** Notifies stakeholders of status changes in appointments.
- **Scheduled Reminders:** Automated reminders sent daily for upcoming appointments.
- **Reporting:** Provides reports on appointments.

---

## 🛠️ Tech Stack
- **Backend:** Spring Boot 3
- **Database:** MySQL 8
- **SMS API:** Twilio
- **Email API:** JavaMailSender (Gmail)
- **Video Calls:** Jitsi
- **Real-Time Communication:** WebSocket
- **Other:** Hibernate, JPA

---

## 🚀 Setup Instructions

### Prerequisites
1. **JDK 17** or above
2. **Maven** for building the project
3. **MySQL 8** installed and running
4. **Twilio Account** for SMS functionality
5. **Gmail Account** for sending email notifications

### Installation Steps

1. Clone this repository:
    \`\`\`bash
    git clone https://github.com/your-username/elderlycarehub-appointment.git
    cd elderlycarehub-appointment
    \`\`\`

2. Set up **MySQL database**:
    \`\`\`sql
    CREATE DATABASE elderlycarehub;
    \`\`\`

3. Configure the database connection in `application.properties`:
    \`\`\`properties
    spring.datasource.url=jdbc:mysql://localhost:3306/elderlycarehub?useUnicode=true&useJDBCCompliantTimezoneShift=true&createDatabaseIfNotExist=true&useLegacyDatetimeCode=false&serverTimezone=UTC
    spring.datasource.username=root
    spring.datasource.password=your_password
    \`\`\`

4. Add your **Twilio** and **Gmail** credentials in `application.properties`:
    \`\`\`properties
    twilio.account.sid=your_twilio_account_sid
    twilio.auth.token=your_twilio_auth_token
    twilio.phone.number=your_twilio_phone_number

    spring.mail.username=your_gmail_username
    spring.mail.password=your_gmail_app_password
    \`\`\`

5. Run the application:
    \`\`\`bash
    mvn spring-boot:run
    \`\`\`

---

## 📡 API Endpoints

Here are some key API endpoints related to **Appointment Management** that you can test using **Postman**:

### 1. **Create Appointment**
- **Method:** \`POST\`
- **Endpoint:** \`/api/appointments\`
- **Description:** Create a new appointment between a patient and a healthcare professional.
- **Request Body:**
    \`\`\`json
    {
      "personneAgeeId": 1,
      "professionnelSanteId": 2,
      "dateHeure": "2025-04-14T10:30:00",
      "remarques": "Patient needs follow-up check-up"
    }
    \`\`\`

### 2. **Get All Appointments**
- **Method:** \`GET\`
- **Endpoint:** \`/api/appointments\`
- **Description:** Get a list of all scheduled appointments.
- **Response:**
    \`\`\`json
    [
      {
        "id": 1,
        "personneAgeeId": 1,
        "professionnelSanteId": 2,
        "dateHeure": "2025-04-14T10:30:00",
        "remarques": "Patient needs follow-up check-up"
      }
    ]
    \`\`\`

### 3. **Send Appointment Reminder**
- **Method:** \`POST\`
- **Endpoint:** \`/api/appointments/send-reminder/{id}\`
- **Description:** Send an SMS/Email reminder for a specific appointment.
- **Parameters:** \`id\` (Appointment ID)
- **Response:** A confirmation message indicating if the reminder was sent.

### 4. **Create Video Consultation Link**
- **Method:** \`POST\`
- **Endpoint:** \`/api/appointments/create-video-link/{id}\`
- **Description:** Create a Jitsi link for virtual consultation for a specific appointment.
- **Response:** Video consultation link.

### 5. **Get Appointment Status**
- **Method:** \`GET\`
- **Endpoint:** \`/api/appointments/status/{id}\`
- **Description:** Get the current status of a specific appointment (e.g., scheduled, completed).
- **Response:**
    \`\`\`json
    {
      "status": "scheduled"
    }
    \`\`\`

### 6. **Scheduled Reminder (Daily)**
- **Method:** Automatically triggered at **9:15 PM** daily
- **Description:** Sends SMS and email reminders for all appointments scheduled for the next day.

---

## 🔄 WebSocket Integration

For real-time appointment status updates, use a WebSocket client (e.g., **Stomp.js** in your frontend) to connect to \`/appointments-status\` and receive status updates.

---

## 🧪 Testing with Postman

Once the application is running, you can test the above endpoints in **Postman**:

1. **Create an Appointment** by sending a \`POST\` request to \`/api/appointments\`.
2. **Send a Reminder** by sending a \`POST\` request to \`/api/appointments/send-reminder/{id}\`.
3. **Generate Video Consultation Link** by sending a \`POST\` request to \`/api/appointments/create-video-link/{id}\`.
4. **Check Appointment Status** by sending a \`GET\` request to \`/api/appointments/status/{id}\`.

---

## ⏰ Scheduled Tasks

- **Appointment Reminders:** This task runs automatically every day at **9:15 PM** (Cron: \`0 30 23 * * ?\`), sending reminders for all appointments scheduled for the next day.
