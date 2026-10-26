package com.eams.eams_chatbot.dto.response;

import com.eams.eams_chatbot.enums.LeaveStatus;
import com.eams.eams_chatbot.enums.LeaveType;
import com.eams.eams_chatbot.model.LeaveRequest;
import lombok.Builder;
import lombok.Data;
import java.time.Instant;
import java.time.LocalDate;

@Data @Builder
public class LeaveResponse {
    private String leaveId;
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

    public static LeaveResponse from(LeaveRequest request) {
        return LeaveResponse.builder().leaveId(request.getId()).employeeId(request.getEmployeeId())
                .employeeName(request.getEmployeeName()).type(request.getType()).startDate(request.getStartDate())
                .endDate(request.getEndDate()).reason(request.getReason()).halfDay(request.isHalfDay())
                .status(request.getStatus()).submittedAt(request.getSubmittedAt()).approvedBy(request.getApprovedBy())
                .reviewerComments(request.getReviewerComments()).build();
    }
}
