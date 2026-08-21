package com.finpulse.server.auth.dto;

import java.time.Instant;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
public class CustomerResponse {
  UUID customerId;
  String name;
  String email;
  String kycStatus;
  Instant createdAt;
}
