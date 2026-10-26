package com.eams.eams_chatbot.model;

import com.eams.eams_chatbot.enums.AttendanceStatus;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Document(collection = "attendance_records")
@CompoundIndex(name = "employee_date_unique", def = "{'employeeId': 1, 'date': 1}", unique = true)
public class AttendanceRecord {
    @Id @JsonProperty("attendanceId") private String id;
    private String employeeId;
    private String employeeName;
    private LocalDate date;
    // Retained for existing clients and old documents; these summarize first-in/last-out.
    private Instant checkIn;
    private Instant checkOut;
    private AttendanceStatus status;
    @Builder.Default private List<AttendanceSession> sessions = new ArrayList<>();
    @Version @JsonIgnore private Long version;

    public List<AttendanceSession> getSessions() {
        if (sessions == null || sessions.isEmpty()) {
            if (checkIn == null) return List.of();
            return List.of(new AttendanceSession("legacy", checkIn, checkOut));
        }
        return sessions;
    }

    @Transient
    public long getTotalWorkedSeconds() {
        Instant now = Instant.now();
        return getSessions().stream().mapToLong(session -> {
            if (session.getCheckIn() == null) return 0;
            Instant end = session.getCheckOut() == null ? now : session.getCheckOut();
            return end.isAfter(session.getCheckIn()) ? Duration.between(session.getCheckIn(), end).getSeconds() : 0;
        }).sum();
    }

    @Transient
    public String getState() {
        if (getSessions().isEmpty()) return "NOT_CHECKED_IN";
        return getSessions().stream().anyMatch(session -> session.getCheckOut() == null) ? "CHECKED_IN" : "CHECKED_OUT";
    }
}
