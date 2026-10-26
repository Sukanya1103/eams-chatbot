package com.eams.eams_chatbot.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ReviewCompensationRequest {
    @Size(max = 1000) private String comments;
}
