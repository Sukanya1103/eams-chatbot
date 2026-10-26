package com.eams.eams_chatbot.repository;

import com.eams.eams_chatbot.enums.CompensationStatus;
import com.eams.eams_chatbot.model.CompensationRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDate;
import java.util.List;

public interface CompensationRequestRepository extends MongoRepository<CompensationRequest, String> {
    List<CompensationRequest> findByEmployeeIdOrderBySubmittedAtDesc(String employeeId);
    List<CompensationRequest> findByStatusOrderBySubmittedAtDesc(CompensationStatus status);
    boolean existsByEmployeeIdAndWorkDate(String employeeId, LocalDate workDate);
}
