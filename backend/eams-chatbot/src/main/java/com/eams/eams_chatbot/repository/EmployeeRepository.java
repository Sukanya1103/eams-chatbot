package com.eams.eams_chatbot.repository;

import com.eams.eams_chatbot.model.Employee;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends MongoRepository<Employee, String> {

    Optional<Employee> findByUserId(String userId);

    // The core query DataScopeService will use for MANAGER role scoping:
    // "give me everyone who reports to this manager".
    List<Employee> findByManagerId(String managerId);

    boolean existsByEmail(String email);
}