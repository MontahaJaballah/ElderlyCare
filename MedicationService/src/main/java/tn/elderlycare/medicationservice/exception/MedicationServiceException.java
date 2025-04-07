package tn.elderlycare.medicationservice.exception;

public class MedicationServiceException extends RuntimeException {
    public MedicationServiceException(String message) {
        super(message);
    }

    public MedicationServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}