package com.eams.eams_chatbot.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Document(collection = "attendance_corrections")
public class AttendanceCorrectionRequest {
    @Id private String id;
    private String employeeId;
    private String employeeName;
    private LocalDate attendanceDate;
    private Instant requestedCheckIn;
    private Instant requestedCheckOut;
    private String reason;
    private String remarks;
    private List<String> agendas;
    private List<String> referenceLinks;
    private String status;
    private Instant submittedAt;
    private String reviewerComments;
}
