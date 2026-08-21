package com.finpulse.server.preference.dto;

import com.finpulse.server.preference.domain.UserPreference;
import java.time.Instant;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
public class UserPreferenceResponse {
  UUID preferenceId;
  UUID customerId;
  String theme;
  String language;
  boolean notificationsEnabled;
  Instant updatedAt;

  public static UserPreferenceResponse from(UserPreference entity) {
    return UserPreferenceResponse.builder()
        .preferenceId(entity.getPreferenceId())
        .customerId(entity.getCustomerId())
        .theme(entity.getTheme())
        .language(entity.getLanguage())
        .notificationsEnabled(entity.isNotificationsEnabled())
        .updatedAt(entity.getUpdatedAt())
        .build();
  }
}
