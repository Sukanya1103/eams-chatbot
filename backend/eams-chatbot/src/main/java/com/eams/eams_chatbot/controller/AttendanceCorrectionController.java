package com.eams.eams_chatbot.controller;

import com.eams.eams_chatbot.dto.request.AttendanceCorrectionRequestDto;
import com.eams.eams_chatbot.model.AttendanceCorrectionRequest;
import com.eams.eams_chatbot.security.UserPrincipal;
import com.eams.eams_chatbot.service.AttendanceCorrectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/attendance/corrections") @RequiredArgsConstructor
@PreAuthorize("hasRole('EMPLOYEE')")
public class AttendanceCorrectionController {
    private final AttendanceCorrectionService correctionService;
    @GetMapping public List<AttendanceCorrectionRequest> list(@AuthenticationPrincipal UserPrincipal caller) {
        return correctionService.list(caller);
    }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public AttendanceCorrectionRequest submit(@Valid @RequestBody AttendanceCorrectionRequestDto request,
                                              @AuthenticationPrincipal UserPrincipal caller) {
        return correctionService.submit(request, caller);
    }
}
