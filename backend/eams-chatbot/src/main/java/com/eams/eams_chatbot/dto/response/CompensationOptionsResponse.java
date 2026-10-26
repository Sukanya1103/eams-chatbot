package com.eams.eams_chatbot.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.Set;

@Data @Builder
public class CompensationOptionsResponse {
    private boolean available;
    private Set<String> supportedTypes;
    private String message;
}
