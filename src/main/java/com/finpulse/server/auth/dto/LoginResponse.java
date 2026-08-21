package com.finpulse.server.auth.dto;

import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
public class LoginResponse {
  String token;
  CustomerResponse customer;
}
