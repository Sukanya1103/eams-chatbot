package com.eams.eams_chatbot.controller;

import com.eams.eams_chatbot.model.AttendanceRecord;
import com.eams.eams_chatbot.security.UserPrincipal;
import com.eams.eams_chatbot.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/attendance") @RequiredArgsConstructor
public class AttendanceController {
    private final AttendanceService attendanceService;
    @GetMapping @PreAuthorize("hasAnyRole('EMPLOYEE', 'MANAGER', 'HR', 'ADMIN')")
    public List<AttendanceRecord> list(@AuthenticationPrincipal UserPrincipal caller) { return attendanceService.list(caller); }
    @PostMapping("/check-in") @ResponseStatus(HttpStatus.CREATED) @PreAuthorize("hasRole('EMPLOYEE')")
    public AttendanceRecord checkIn(@AuthenticationPrincipal UserPrincipal caller) { return attendanceService.checkIn(caller); }
    @PostMapping("/check-out") @PreAuthorize("hasRole('EMPLOYEE')")
    public AttendanceRecord checkOut(@AuthenticationPrincipal UserPrincipal caller) { return attendanceService.checkOut(caller); }
}
