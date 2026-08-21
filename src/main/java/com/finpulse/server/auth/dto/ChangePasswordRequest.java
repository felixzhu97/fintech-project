package com.finpulse.server.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
public class ChangePasswordRequest {
  @NotBlank String currentPassword;
  @NotBlank String newPassword;
}
