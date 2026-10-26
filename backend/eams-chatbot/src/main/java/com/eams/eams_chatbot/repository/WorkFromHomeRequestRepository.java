package com.eams.eams_chatbot.repository;

import com.eams.eams_chatbot.model.WorkFromHomeRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface WorkFromHomeRequestRepository extends MongoRepository<WorkFromHomeRequest, String> {
    List<WorkFromHomeRequest> findByEmployeeIdOrderBySubmittedAtDesc(String employeeId);
}
