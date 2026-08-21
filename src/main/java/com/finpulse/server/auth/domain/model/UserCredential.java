package com.finpulse.server.auth.domain.model;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

public final class UserCredential {
  private final UUID credentialId;
  private final UUID customerId;
  private final String email;
  private String passwordHash;
  private final Instant createdAt;

  private UserCredential(
      UUID credentialId, UUID customerId, String email, String passwordHash, Instant createdAt) {
    this.credentialId = Objects.requireNonNull(credentialId);
    this.customerId = Objects.requireNonNull(customerId);
    this.email = Objects.requireNonNull(email);
    this.passwordHash = Objects.requireNonNull(passwordHash);
    this.createdAt = createdAt == null ? Instant.now() : createdAt;
  }

  public static UserCredential create(UUID customerId, String email, String passwordHash) {
    return new UserCredential(UUID.randomUUID(), customerId, email, passwordHash, Instant.now());
  }

  public static UserCredential rehydrate(
      UUID credentialId, UUID customerId, String email, String passwordHash, Instant createdAt) {
    return new UserCredential(credentialId, customerId, email, passwordHash, createdAt);
  }

  public void updatePasswordHash(String passwordHash) {
    this.passwordHash = Objects.requireNonNull(passwordHash);
  }

  public UUID credentialId() {
    return credentialId;
  }

  public UUID customerId() {
    return customerId;
  }

  public String email() {
    return email;
  }

  public String passwordHash() {
    return passwordHash;
  }

  public Instant createdAt() {
    return createdAt;
  }
}
