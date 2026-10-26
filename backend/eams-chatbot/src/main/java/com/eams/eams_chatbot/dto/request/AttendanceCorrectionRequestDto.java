package com.eams.eams_chatbot.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class AttendanceCorrectionRequestDto {
    @NotNull private LocalDate attendanceDate;
    @NotNull private LocalTime checkInTime;
    @NotNull private LocalDate checkOutDate;
    @NotNull private LocalTime checkOutTime;
    @NotBlank @Size(max = 120) private String reason;
    @Size(max = 1000) private String remarks;
    @Size(max = 10) private List<@NotBlank @Size(max = 200) String> agendas;
    @Size(max = 10) private List<@NotBlank @Size(max = 500) String> referenceLinks;
}
