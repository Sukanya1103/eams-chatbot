package com.eams.eams_chatbot.repository;

import com.eams.eams_chatbot.model.AttendanceCorrectionRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AttendanceCorrectionRepository extends MongoRepository<AttendanceCorrectionRequest, String> {
    List<AttendanceCorrectionRequest> findByEmployeeIdOrderBySubmittedAtDesc(String employeeId);
}
