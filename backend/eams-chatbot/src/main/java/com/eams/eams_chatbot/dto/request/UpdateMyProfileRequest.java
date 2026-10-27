package com.eams.eams_chatbot.dto.request;

import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateMyProfileRequest {

    @NotBlank
    @Size(max = 120)
    private String name;

    @PastOrPresent
    private LocalDate dateOfBirth;

    @Pattern(regexp = "^$|^[+0-9() .-]{7,20}$", message = "Enter a valid phone number")
    private String contactNumber;
}
