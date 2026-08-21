package com.finpulse.server.customer.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
public class CustomerRequest {
  @NotBlank String name;
  String email;
  String kycStatus;
}
