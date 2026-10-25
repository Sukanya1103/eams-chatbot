package com.eams.eams_chatbot.dto.response;

import com.eams.eams_chatbot.enums.CompensationDayType;
import com.eams.eams_chatbot.enums.CompensationStatus;
import com.eams.eams_chatbot.model.CompensationRequest;
import lombok.Builder;
import lombok.Data;
import java.time.Instant;
import java.time.LocalDate;

@Data @Builder
public class CompensationResponse {
    private String id;
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
    private Instant reviewedAt;

    public static CompensationResponse from(CompensationRequest request) {
        return CompensationResponse.builder().id(request.getId()).employeeId(request.getEmployeeId())
                .employeeName(request.getEmployeeName()).workDate(request.getWorkDate()).dayType(request.getDayType())
                .verifiedCheckIn(request.getVerifiedCheckIn()).verifiedCheckOut(request.getVerifiedCheckOut())
                .verifiedWorkedMinutes(request.getVerifiedWorkedMinutes()).compensationType(request.getCompensationType())
                .reason(request.getReason()).status(request.getStatus()).reviewedBy(request.getReviewedBy())
                .reviewerComments(request.getReviewerComments()).submittedAt(request.getSubmittedAt())
                .reviewedAt(request.getReviewedAt()).build();
    }
}
