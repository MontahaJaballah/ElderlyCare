FROM openjdk:17-jdk-alpine
VOLUME /tmp COPY target/*.jar medication.jar
EXPOSE 8082 ENTRYPOINT ["java", "-jar", "/medication.jar"]