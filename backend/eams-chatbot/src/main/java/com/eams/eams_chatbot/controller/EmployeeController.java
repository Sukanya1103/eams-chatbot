package com.eams.eams_chatbot.controller;

import com.eams.eams_chatbot.dto.request.RegisterEmployeeRequest;
import com.eams.eams_chatbot.dto.request.UpdateMyProfileRequest;
import com.eams.eams_chatbot.dto.response.EmployeeResponse;
import com.eams.eams_chatbot.dto.response.MyProfileResponse;
import com.eams.eams_chatbot.service.EmployeeService;
import com.eams.eams_chatbot.service.MyProfileService;
import com.eams.eams_chatbot.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;
    private final MyProfileService myProfileService;

    @GetMapping("/me")
    public ResponseEntity<MyProfileResponse> myProfile(@AuthenticationPrincipal UserPrincipal caller) {
        return ResponseEntity.ok(myProfileService.getMyProfile(caller));
    }

    @PatchMapping("/me")
    public ResponseEntity<MyProfileResponse> updateMyProfile(
            @Valid @RequestBody UpdateMyProfileRequest request,
            @AuthenticationPrincipal UserPrincipal caller) {
        return ResponseEntity.ok(myProfileService.updateMyProfile(caller, request));
    }

    // Only HR and Admin can register new employees — enforced here AND
    // this is the pattern every future protected endpoint should follow:
    // never rely on the frontend to hide a button as the only protection.
    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    @PostMapping("/register")
    public ResponseEntity<EmployeeResponse> register(@Valid @RequestBody RegisterEmployeeRequest request) {
        return ResponseEntity.ok(employeeService.registerEmployee(request));
    }

    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    @GetMapping
    public ResponseEntity<List<EmployeeResponse>> list() {
        return ResponseEntity.ok(employeeService.getEmployees());
    }
}
