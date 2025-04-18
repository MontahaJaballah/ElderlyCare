    FROM openjdk:17
    EXPOSE 8089
    ADD target/api-gateway-0.0.1-SNAPSHOT.jar gateway.jar
    ENTRYPOINT ["java", "-jar", "gateway.jar"]