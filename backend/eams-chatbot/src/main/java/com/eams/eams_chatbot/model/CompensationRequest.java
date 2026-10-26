package com.eams.eams_chatbot.model;

import com.eams.eams_chatbot.enums.CompensationDayType;
import com.eams.eams_chatbot.enums.CompensationStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.time.LocalDate;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Document(collection = "compensation_requests")
@CompoundIndex(name = "employee_work_date_unique", def = "{'employeeId': 1, 'workDate': 1}", unique = true)
public class CompensationRequest {
    @Id private String id;
    private String employeeId;
    private String employeeName;
    private LocalDate workDate;
    private CompensationDayType dayType;
    private Instant verifiedCheckIn;
    private Instant verifiedCheckOut;
    private long verifiedWorkedMinutes;
    private String compensationType;
    private String reason;
    private CompensationStatus status;
    private String reviewedBy;
    private String reviewerComments;
    private Instant submittedAt;
    private Instant updatedAt;
    private Instant reviewedAt;
    @Version @JsonIgnore private Long version;
}
