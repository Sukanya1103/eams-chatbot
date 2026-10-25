package com.eams.eams_chatbot.model;

import com.eams.eams_chatbot.enums.AttendanceStatus;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;
import java.time.LocalDate;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Document(collection = "attendance_records")
@CompoundIndex(name = "employee_date_unique", def = "{'employeeId': 1, 'date': 1}", unique = true)
public class AttendanceRecord {
    @Id @JsonProperty("attendanceId") private String id;
    private String employeeId;
    private String employeeName;
    private LocalDate date;
    private Instant checkIn;
    private Instant checkOut;
    private AttendanceStatus status;
}
