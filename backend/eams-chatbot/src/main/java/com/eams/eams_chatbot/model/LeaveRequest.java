package com.eams.eams_chatbot.model;

import com.eams.eams_chatbot.enums.LeaveStatus;
import com.eams.eams_chatbot.enums.LeaveType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "leave_requests")
public class LeaveRequest {
    @Id private String id;
    private String employeeId;
    private String employeeName;
    private LeaveType type;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
    private boolean halfDay;
    private LeaveStatus status;
    private Instant submittedAt;
    private String approvedBy;
    private String reviewerComments;
}
