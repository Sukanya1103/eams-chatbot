package com.eams.eams_chatbot.dto.request;

import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateMyProfileRequest {

    @PastOrPresent
    private LocalDate dateOfBirth;

    @Pattern(regexp = "^$|^[+0-9() .-]{7,20}$", message = "Enter a valid phone number")
    private String contactNumber;
}
