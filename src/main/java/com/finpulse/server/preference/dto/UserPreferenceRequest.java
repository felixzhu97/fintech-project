package com.finpulse.server.preference.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
public class UserPreferenceRequest {
  @NotNull UUID customerId;
  String theme;
  String language;
  boolean notificationsEnabled;
}
