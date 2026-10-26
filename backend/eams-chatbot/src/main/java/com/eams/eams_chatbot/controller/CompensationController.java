package com.eams.eams_chatbot.controller;

import com.eams.eams_chatbot.dto.request.ReviewCompensationRequest;
import com.eams.eams_chatbot.dto.request.SubmitCompensationRequest;
import com.eams.eams_chatbot.dto.response.CompensationOptionsResponse;
import com.eams.eams_chatbot.dto.response.CompensationResponse;
import com.eams.eams_chatbot.security.UserPrincipal;
import com.eams.eams_chatbot.service.CompensationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/compensation") @RequiredArgsConstructor
public class CompensationController {
    private final CompensationService compensationService;

    @GetMapping("/options") @PreAuthorize("hasRole('EMPLOYEE')")
    public CompensationOptionsResponse options() { return compensationService.options(); }

    @PostMapping @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<CompensationResponse> submit(@Valid @RequestBody SubmitCompensationRequest request,
                                                        @AuthenticationPrincipal UserPrincipal caller) {
        return ResponseEntity.status(HttpStatus.CREATED).body(compensationService.submit(request, caller));
    }

    @GetMapping("/my-requests") @PreAuthorize("hasRole('EMPLOYEE')")
    public List<CompensationResponse> myRequests(@AuthenticationPrincipal UserPrincipal caller) { return compensationService.myRequests(caller); }

    @GetMapping("/pending") @PreAuthorize("hasAnyRole('MANAGER', 'HR', 'ADMIN')")
    public List<CompensationResponse> pending(@AuthenticationPrincipal UserPrincipal caller) { return compensationService.pending(caller); }

    @GetMapping("/{id}") @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'HR', 'ADMIN')")
    public CompensationResponse get(@PathVariable String id, @AuthenticationPrincipal UserPrincipal caller) { return compensationService.get(id, caller); }

    @PatchMapping("/{id}/approve") @PreAuthorize("hasAnyRole('MANAGER', 'HR', 'ADMIN')")
    public CompensationResponse approve(@PathVariable String id, @Valid @RequestBody(required = false) ReviewCompensationRequest request,
                                        @AuthenticationPrincipal UserPrincipal caller) {
        return compensationService.review(id, true, request == null ? null : request.getComments(), caller);
    }

    @PatchMapping("/{id}/reject") @PreAuthorize("hasAnyRole('MANAGER', 'HR', 'ADMIN')")
    public CompensationResponse reject(@PathVariable String id, @Valid @RequestBody(required = false) ReviewCompensationRequest request,
                                       @AuthenticationPrincipal UserPrincipal caller) {
        return compensationService.review(id, false, request == null ? null : request.getComments(), caller);
    }
}
