package com.eams.eams_chatbot.repository;

import com.eams.eams_chatbot.model.LeaveRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface LeaveRequestRepository extends MongoRepository<LeaveRequest, String> {
    List<LeaveRequest> findByEmployeeIdOrderBySubmittedAtDesc(String employeeId);
    List<LeaveRequest> findAllByOrderBySubmittedAtDesc();
}
