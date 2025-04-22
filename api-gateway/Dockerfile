FROM openjdk:17-jdk-alpine
VOLUME /tmp COPY target/*.jar app.jar
EXPOSE 8093 ENTRYPOINT ["java", "-jar", "/app.jar"]