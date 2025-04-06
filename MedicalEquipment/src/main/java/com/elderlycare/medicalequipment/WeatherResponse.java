package com.elderlycare.medicalequipment;

public class WeatherResponse {
    private String city;
    private double temperature;
    private int humidity;
    private String equipmentSafety;

    public WeatherResponse(String city, double temperature, int humidity, String equipmentSafety) {
        this.city = city;
        this.temperature = temperature;
        this.humidity = humidity;
        this.equipmentSafety = equipmentSafety;
    }

    // Getters
    public String getCity() { return city; }
    public double getTemperature() { return temperature; }
    public int getHumidity() { return humidity; }
    public String getEquipmentSafety() { return equipmentSafety; }

    // Setters
    public void setCity(String city) { this.city = city; }
    public void setTemperature(double temperature) { this.temperature = temperature; }
    public void setHumidity(int humidity) { this.humidity = humidity; }
    public void setEquipmentSafety(String equipmentSafety) { this.equipmentSafety = equipmentSafety; }
}
