package com.eams.eams_chatbot.repository;

import com.eams.eams_chatbot.model.AttendanceRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRecordRepository extends MongoRepository<AttendanceRecord, String> {
    Optional<AttendanceRecord> findByEmployeeIdAndDate(String employeeId, LocalDate date);
    Optional<AttendanceRecord> findFirstByEmployeeIdAndCheckOutIsNullOrderByDateDesc(String employeeId);
    List<AttendanceRecord> findByEmployeeIdOrderByDateDesc(String employeeId);
    List<AttendanceRecord> findAllByOrderByDateDesc();
}
