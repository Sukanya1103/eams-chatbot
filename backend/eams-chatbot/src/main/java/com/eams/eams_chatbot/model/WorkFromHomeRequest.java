package com.eams.eams_chatbot.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.time.LocalDate;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Document(collection = "work_from_home_requests")
public class WorkFromHomeRequest {
    @Id private String id;
    private String employeeId;
    private String employeeName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
    private String remarks;
    private String status;
    private Instant submittedAt;
    private String reviewerComments;
}
