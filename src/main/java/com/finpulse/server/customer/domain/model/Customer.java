package com.finpulse.server.customer.domain.model;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

public final class Customer {
  private final UUID customerId;
  private final String name;
  private final String email;
  private final String kycStatus;
  private final Instant createdAt;

  private Customer(UUID customerId, String name, String email, String kycStatus, Instant createdAt) {
    this.customerId = Objects.requireNonNull(customerId);
    this.name = Objects.requireNonNull(name);
    this.email = email;
    this.kycStatus = kycStatus;
    this.createdAt = createdAt == null ? Instant.now() : createdAt;
  }

  public static Customer create(String name, String email) {
    return new Customer(UUID.randomUUID(), name, email, null, Instant.now());
  }

  public static Customer rehydrate(
      UUID customerId, String name, String email, String kycStatus, Instant createdAt) {
    return new Customer(customerId, name, email, kycStatus, createdAt);
  }

  public UUID customerId() { return customerId; }
  public String name() { return name; }
  public String email() { return email; }
  public String kycStatus() { return kycStatus; }
  public Instant createdAt() { return createdAt; }
}
