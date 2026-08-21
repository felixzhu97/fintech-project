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
public final class UserCredential {
  @NonNull private final UUID credentialId;
  @NonNull private final UUID customerId;
  @NonNull private final String email;
  @NonNull private String passwordHash;
  @NonNull private final Instant createdAt;

  public static UserCredential create(UUID customerId, String email, String passwordHash) {
    return new UserCredential(UUID.randomUUID(), customerId, email, passwordHash, Instant.now());
  }

  public static UserCredential rehydrate(
      UUID credentialId, UUID customerId, String email, String passwordHash, Instant createdAt) {
    return new UserCredential(
        credentialId,
        customerId,
        email,
        passwordHash,
        createdAt == null ? Instant.now() : createdAt);
  }

  public void updatePasswordHash(@NonNull String passwordHash) {
    this.passwordHash = passwordHash;
  }
}
