package com.finpulse.server.account.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
public class AccountRequest {
  @NotNull UUID customerId;
  @NotBlank String accountType;
  @NotBlank String currency;
  String status;
}
