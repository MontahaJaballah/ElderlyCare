package tn.elderlycare.medicationservice.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class FrequencyParser {

    private static final Logger logger = LoggerFactory.getLogger(FrequencyParser.class);

    public static List<LocalDateTime> calculateNextDosageTimes(String frequency, LocalDateTime startTime, int numberOfDoses) {
        logger.debug("Calculating dosage times for frequency: {}, startTime: {}, numberOfDoses: {}", frequency, startTime, numberOfDoses);
        List<LocalDateTime> dosageTimes = new ArrayList<>();
        dosageTimes.add(startTime);

        // Parse frequency (e.g., "every 6 hours")
        Pattern pattern = Pattern.compile("every (\\d+) (\\w+)");
        Matcher matcher = pattern.matcher(frequency.toLowerCase());
        if (!matcher.matches()) {
            logger.error("Invalid frequency format: {}. Expected format: 'every X hours/days'", frequency);
            throw new IllegalArgumentException("Invalid frequency format. Expected format: 'every X hours/days'");
        }

        int interval = Integer.parseInt(matcher.group(1));
        String unit = matcher.group(2);
        logger.debug("Parsed frequency: interval={}, unit={}", interval, unit);

        ChronoUnit chronoUnit;
        switch (unit) {
            case "hour":
            case "hours":
                chronoUnit = ChronoUnit.HOURS;
                break;
            case "day":
            case "days":
                chronoUnit = ChronoUnit.DAYS;
                break;
            default:
                logger.error("Unsupported frequency unit: {}", unit);
                throw new IllegalArgumentException("Unsupported frequency unit: " + unit);
        }

        // Calculate the next dosage times
        LocalDateTime currentTime = startTime;
        for (int i = 1; i < numberOfDoses; i++) {
            currentTime = currentTime.plus(interval, chronoUnit);
            dosageTimes.add(currentTime);
            logger.debug("Calculated dosage time: {}", currentTime);
        }

        logger.debug("Dosage times calculated: {}", dosageTimes);
        return dosageTimes;
    }
}