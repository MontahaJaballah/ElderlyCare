FROM openjdk:17-jdk-alpine

VOLUME /tmp

COPY target/MedicationService-0.0.1-SNAPSHOT.jar medication.jar

EXPOSE 8082

ENTRYPOINT ["java", "-jar", "/medication.jar"]
