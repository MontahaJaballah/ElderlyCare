package com.esprit.microservice.rendezvous.services;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsService {
    private static final Logger logger = LoggerFactory.getLogger(SmsService.class);

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String twilioPhoneNumber;

    public void sendSms(String to, String messageBody) {
        try {
            Twilio.init(accountSid, authToken);

            String formattedTo = to.startsWith("+") ? to : "+" + to;
            String formattedTwilioPhone = twilioPhoneNumber.startsWith("+") ? twilioPhoneNumber : "+" + twilioPhoneNumber;

            logger.info("Sending SMS to: " + formattedTo);

            Message message = Message.creator(
                    new com.twilio.type.PhoneNumber(formattedTo),
                    new com.twilio.type.PhoneNumber(formattedTwilioPhone),
                    messageBody
            ).create();

            logger.info("SMS sent successfully! Message SID: " + message.getSid());
        } catch (Exception e) {
            logger.error("Failed to send SMS: " + e.getMessage(), e);
        }
    }
}
