package com.eams.eams_chatbot.model;

import org.junit.jupiter.api.Test;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertEquals;

class AttendanceRecordTest {
    @Test void dailyDurationSumsSessionsAndLegacyRecordsRemainReadable() {
        Instant day = Instant.parse("2026-10-26T00:00:00Z");
        AttendanceRecord record = AttendanceRecord.builder().date(LocalDate.of(2026, 10, 26)).sessions(List.of(
                new AttendanceSession("one", day, day.plusSeconds(7200)),
                new AttendanceSession("two", day.plusSeconds(14400), day.plusSeconds(25200)))).build();
        assertEquals(5 * 3600, record.getTotalWorkedSeconds());
        assertEquals("CHECKED_OUT", record.getState());

        AttendanceRecord legacy = AttendanceRecord.builder().date(LocalDate.of(2026, 10, 26))
                .checkIn(day).checkOut(day.plusSeconds(17)).build();
        assertEquals("legacy", legacy.getSessions().getFirst().getSessionId());
        assertEquals(17, legacy.getTotalWorkedSeconds());
    }
}
