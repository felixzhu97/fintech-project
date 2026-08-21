package com.finpulse.server.customer.domain.model;

import java.time.Instant;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;
import lombok.experimental.Accessors;

@Getter
@Accessors(fluent = true)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public final class Customer {
  @NonNull private final UUID customerId;
  @NonNull private final String name;
  private final String email;
  private final String kycStatus;
  @NonNull private final Instant createdAt;

  public static Customer create(String name, String email) {
    return new Customer(UUID.randomUUID(), name, email, null, Instant.now());
  }

  public static Customer rehydrate(
      UUID customerId, String name, String email, String kycStatus, Instant createdAt) {
    return new Customer(
        customerId, name, email, kycStatus, createdAt == null ? Instant.now() : createdAt);
  }
}
