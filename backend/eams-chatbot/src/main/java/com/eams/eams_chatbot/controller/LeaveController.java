package com.eams.eams_chatbot.controller;

import com.eams.eams_chatbot.dto.request.ApplyLeaveRequest;
import com.eams.eams_chatbot.dto.response.LeaveResponse;
import com.eams.eams_chatbot.security.UserPrincipal;
import com.eams.eams_chatbot.service.LeaveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/leaves") @RequiredArgsConstructor
public class LeaveController {
    private final LeaveService leaveService;

    @GetMapping
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'HR', 'ADMIN')")
    public List<LeaveResponse> list(@AuthenticationPrincipal UserPrincipal caller) { return leaveService.list(caller); }

    @PostMapping
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<LeaveResponse> apply(@Valid @RequestBody ApplyLeaveRequest request,
                                                @AuthenticationPrincipal UserPrincipal caller) {
        return ResponseEntity.status(HttpStatus.CREATED).body(leaveService.apply(request, caller));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('MANAGER', 'HR', 'ADMIN')")
    public LeaveResponse approve(@PathVariable String id, @AuthenticationPrincipal UserPrincipal caller) {
        return leaveService.review(id, true, caller);
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('MANAGER', 'HR', 'ADMIN')")
    public LeaveResponse reject(@PathVariable String id, @AuthenticationPrincipal UserPrincipal caller) {
        return leaveService.review(id, false, caller);
    }
}
