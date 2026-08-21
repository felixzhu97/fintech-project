package com.finpulse.server.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
public class RegisterRequest {
  @NotBlank String name;
  @NotBlank String email;
  @NotBlank String password;
}
