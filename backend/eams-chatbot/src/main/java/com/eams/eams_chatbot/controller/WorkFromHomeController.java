package com.eams.eams_chatbot.controller;

import com.eams.eams_chatbot.dto.request.ApplyWorkFromHomeRequest;
import com.eams.eams_chatbot.model.WorkFromHomeRequest;
import com.eams.eams_chatbot.security.UserPrincipal;
import com.eams.eams_chatbot.service.WorkFromHomeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/work-from-home") @RequiredArgsConstructor
@PreAuthorize("hasRole('EMPLOYEE')")
public class WorkFromHomeController {
    private final WorkFromHomeService workFromHomeService;
    @GetMapping public List<WorkFromHomeRequest> list(@AuthenticationPrincipal UserPrincipal caller) {
        return workFromHomeService.list(caller);
    }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public WorkFromHomeRequest apply(@Valid @RequestBody ApplyWorkFromHomeRequest request,
                                     @AuthenticationPrincipal UserPrincipal caller) {
        return workFromHomeService.apply(request, caller);
    }
}
