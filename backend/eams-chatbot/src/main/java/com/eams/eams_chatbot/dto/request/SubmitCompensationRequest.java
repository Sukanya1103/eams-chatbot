package com.eams.eams_chatbot.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDate;

@Data
public class SubmitCompensationRequest {
    @NotNull private LocalDate workDate;
    @NotBlank @Size(max = 80) private String compensationType;
    @NotBlank @Size(max = 1000) private String reason;
}
