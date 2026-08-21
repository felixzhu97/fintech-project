package com.finpulse.server.cashtransaction.dto;

import java.math.BigDecimal;
import java.util.UUID;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
public class CashTransactionRequest {
  @NotNull UUID accountId;
  @NotBlank String type;
  @NotNull BigDecimal amount;
  @NotBlank String currency;
  @NotBlank String status;
}
