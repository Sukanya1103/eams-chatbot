package com.eams.eams_chatbot.model;

import lombok.*;
import java.time.Instant;

@Data @NoArgsConstructor @AllArgsConstructor
public class AttendanceSession {
    private String sessionId;
    private Instant checkIn;
    private Instant checkOut;
}
