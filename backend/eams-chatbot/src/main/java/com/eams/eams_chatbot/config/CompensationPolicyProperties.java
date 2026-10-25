package com.eams.eams_chatbot.config;

import com.eams.eams_chatbot.enums.CompensationDayType;
import com.eams.eams_chatbot.enums.Role;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Data
@Component
@ConfigurationProperties(prefix = "eams.compensation")
/**
 * All values are intentionally unset/disabled by default. HR must supply
 * enabled, minimum-worked-hours, allowed-types, eligible-day-types, and
 * reviewer-roles through the deployment's Spring configuration source.
 */
public class CompensationPolicyProperties {
    private boolean enabled;
    private BigDecimal minimumWorkedHours;
    private Set<String> allowedTypes = new HashSet<>();
    private Set<CompensationDayType> eligibleDayTypes = new HashSet<>();
    private Set<Role> reviewerRoles = new HashSet<>();

    public boolean isConfigured() {
        return enabled && minimumWorkedHours != null && minimumWorkedHours.signum() > 0
                && minimumWorkedHours.compareTo(BigDecimal.valueOf(24)) <= 0
                && allowedTypes != null && !allowedTypes.isEmpty()
                && allowedTypes.stream().noneMatch(String::isBlank)
                && eligibleDayTypes != null && eligibleDayTypes.equals(Set.of(CompensationDayType.WEEKLY_OFF))
                && reviewerRoles != null && !reviewerRoles.isEmpty() && !reviewerRoles.contains(Role.EMPLOYEE);
    }
}
