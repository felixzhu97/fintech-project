package com.finpulse.server.auth.domain.model;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

public final class Session {
  private final UUID sessionId;
  private final UUID customerId;
  private final String token;
  private final Instant expiresAt;
  private final Instant createdAt;

  private Session(
      UUID sessionId, UUID customerId, String token, Instant expiresAt, Instant createdAt) {
    this.sessionId = Objects.requireNonNull(sessionId);
    this.customerId = Objects.requireNonNull(customerId);
    this.token = Objects.requireNonNull(token);
    this.expiresAt = Objects.requireNonNull(expiresAt);
    this.createdAt = createdAt == null ? Instant.now() : createdAt;
  }

  public static Session create(UUID customerId, String token, Instant expiresAt) {
    return new Session(UUID.randomUUID(), customerId, token, expiresAt, Instant.now());
  }

  public static Session rehydrate(
      UUID sessionId, UUID customerId, String token, Instant expiresAt, Instant createdAt) {
    return new Session(sessionId, customerId, token, expiresAt, createdAt);
  }

  public boolean isExpired() {
    return Instant.now().isAfter(expiresAt);
  }

  public UUID sessionId() {
    return sessionId;
  }

  public UUID customerId() {
    return customerId;
  }

  public String token() {
    return token;
  }

  public Instant expiresAt() {
    return expiresAt;
  }

  public Instant createdAt() {
    return createdAt;
  }
}
