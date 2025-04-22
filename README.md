# ElderlyCare Platform

A comprehensive microservices-based platform designed to support elderly care management, including medical equipment tracking, doctor management, medication services, and appointment scheduling.

## Table of Contents
- [About the Project](#about-the-project)
- [Architecture Overview](#architecture-overview)
- [Microservices](#microservices)
- [API Gateway](#api-gateway)
- [Service Discovery (Eureka)](#service-discovery-eureka)
- [Configuration Server](#configuration-server)
- [Keycloak Integration](#keycloak-integration)
- [Docker Deployment](#docker-deployment)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)

## About the Project

**ElderlyCareHub** is a platform designed to connect elderly individuals with healthcare services, real-time monitoring, and AI-powered assistance. The platform includes features for equipment management, medication tracking, appointment scheduling, and doctor management.

## Architecture Overview

ElderlyCare is built on a microservices architecture with the following components:
- **API Gateway**: Routes requests to appropriate services
- **Eureka Server**: Service discovery and registration
- **Configuration Server**: Centralized configuration management
- **Keycloak**: Authentication and authorization
- **Frontend**: Angular-based user interface
- **Microservices**: Various domain-specific services

## Microservices

The platform consists of the following microservices:
- **User Service**: Manages user accounts and profiles
- **Doctor Management**: Handles doctor information and availability
- **Medical Equipment**: Tracks medical equipment inventory and usage
- **Medication Service**: Manages medication prescriptions and schedules
- **Rendez-Vous Service**: Handles appointment scheduling and management

## API Gateway

The API Gateway serves as the entry point for all client requests and routes them to the appropriate microservices.

### Configuration

The API Gateway is configured to:
- Route requests to appropriate microservices
- Register with Eureka for service discovery
- Implement authentication via Keycloak
- Handle cross-cutting concerns like logging and monitoring

### Deployment Settings

```yaml
api-gateway:
  build: ./api-gateway
  image: montahajaballah/api-gateway:latest 
  container_name: api-gateway
  ports:
    - "8093:8093"
  environment:
    - EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
    - EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
    - EUREKA_CLIENT_FETCH_REGISTRY=true
    - EUREKA_INSTANCE_PREFER_IP_ADDRESS=true
  depends_on:
    - eureka-server
  networks:
    - microservices-net
```

## Service Discovery (Eureka)

Eureka Server provides service discovery functionality, allowing microservices to find and communicate with each other without hardcoding hostnames and ports.

### Deployment Settings

```yaml
eureka-server:
  build: ./eureka-server
  image: montahajaballah/eureka-server:latest 
  container_name: eureka-server
  ports:
    - "8761:8761"
  networks:
    - microservices-net
```

## Configuration Server

The Configuration Server provides centralized configuration management for all microservices in the system.

### Features
- Centralized configuration for all microservices
- Environment-specific configuration profiles
- Runtime configuration updates

### Setup
The Configuration Server is located in the `Server_config` directory and uses Spring Cloud Config Server to manage configurations.

## Keycloak Integration

Keycloak provides authentication and authorization services for the ElderlyCare platform.

### Configuration

The frontend application integrates with Keycloak using the following configuration:

```typescript
const keycloakConfig = {
  url: 'http://localhost:8080/',
  realm: 'ElderlyCareKeycloak',
  clientId: 'elderly-care-frontend'
};
```

### Features
- Single Sign-On (SSO)
- Role-based access control
- Token-based authentication
- User profile management

### User Roles
- `equip_admin`: Healthcare professionals with administrative privileges
- Regular users: Elderly persons accessing care services

## Docker Deployment

The entire platform can be deployed using Docker Compose, which orchestrates the deployment of all services.

### Docker Compose Configuration

```yaml
version: '3.8'

services:
  eureka-server:
    build: ./eureka-server
    image: montahajaballah/eureka-server:latest 
    container_name: eureka-server
    ports:
      - "8761:8761"
    networks:
      - microservices-net

  api-gateway:
    build: ./api-gateway
    image: montahajaballah/api-gateway:latest 
    container_name: api-gateway
    ports:
      - "8093:8093"
    environment:
      - EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
      - EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
      - EUREKA_CLIENT_FETCH_REGISTRY=true
      - EUREKA_INSTANCE_PREFER_IP_ADDRESS=true
    depends_on:
      - eureka-server
    networks:
      - microservices-net

  microproject:
    build: ./microproject
    image: montahajaballah/microproject:latest 
    container_name: microproject
    ports:
      - "8082:8082"
    environment:
      - EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka/
      - EUREKA_CLIENT_REGISTER_WITH_EUREKA=true
      - EUREKA_CLIENT_FETCH_REGISTRY=true
      - EUREKA_INSTANCE_PREFER_IP_ADDRESS=true
    depends_on:
      - eureka-server
    networks:
      - microservices-net

networks:
  microservices-net:
    driver: bridge
```

### Deployment Steps

1. Make sure Docker and Docker Compose are installed
2. Navigate to the project root directory
3. Run `docker-compose up -d` to start all services
4. Access the Eureka dashboard at http://localhost:8761
5. Access the application through the API Gateway at http://localhost:8093

## Getting Started

To run the application locally:

1. Start the Keycloak server
2. Start the Configuration Server
3. Start the Eureka Server
4. Start the API Gateway
5. Start the required microservices
6. Start the frontend application

## Environment Variables

The application uses the following environment variables:

- `OPENWEATHER_API_KEY`: API key for OpenWeatherMap integration
- `MAILERSEND_API_KEY`: API key for MailerSend email service
- `FROM_EMAIL`: Sender email address for notifications
- `TO_EMAIL`: Recipient email address for notifications

These variables are stored in a `.env` file and accessed using Spring's Environment configuration.

## Additional Features

- Equipment codes are automatically generated as EQ-{id}
- PDF reports include scannable barcodes
- Weather monitoring runs on a scheduled basis
- AI chatbot integration available
- Email notifications for important events
