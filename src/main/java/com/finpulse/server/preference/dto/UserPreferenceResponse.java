package com.finpulse.server.preference.dto;

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
}
