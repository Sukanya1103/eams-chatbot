package com.eams.eams_chatbot.dto.request;

import com.eams.eams_chatbot.enums.LeaveType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ApplyLeaveRequest {
    @NotNull private LeaveType type;
    @NotNull private LocalDate startDate;
    @NotNull private LocalDate endDate;
    @NotBlank @Size(max = 1000) private String reason;
    private boolean halfDay;
}
