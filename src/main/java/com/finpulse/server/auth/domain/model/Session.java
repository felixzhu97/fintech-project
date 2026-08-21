package com.finpulse.server.auth.domain.model;

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
public final class Session {
  @NonNull private final UUID sessionId;
  @NonNull private final UUID customerId;
  @NonNull private final String token;
  @NonNull private final Instant expiresAt;
  @NonNull private final Instant createdAt;

  public static Session create(UUID customerId, String token, Instant expiresAt) {
    return new Session(UUID.randomUUID(), customerId, token, expiresAt, Instant.now());
  }

  public static Session rehydrate(
      UUID sessionId, UUID customerId, String token, Instant expiresAt, Instant createdAt) {
    return new Session(
        sessionId,
        customerId,
        token,
        expiresAt,
        createdAt == null ? Instant.now() : createdAt);
  }

  public boolean isExpired() {
    return Instant.now().isAfter(expiresAt);
  }
}
