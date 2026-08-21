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
  @NonNull private String name;
  private String email;
  private String kycStatus;
  @NonNull private final Instant createdAt;

  public static Customer create(String name, String email) {
    return create(name, email, null);
  }

  public static Customer create(String name, String email, String kycStatus) {
    return new Customer(UUID.randomUUID(), name, email, kycStatus, Instant.now());
  }

  public static Customer rehydrate(
      UUID customerId, String name, String email, String kycStatus, Instant createdAt) {
    return new Customer(
        customerId, name, email, kycStatus, createdAt == null ? Instant.now() : createdAt);
  }

  public void update(@NonNull String name, String email, String kycStatus) {
    this.name = name;
    this.email = email;
    this.kycStatus = kycStatus;
  }
}
