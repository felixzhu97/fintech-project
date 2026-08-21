package com.finpulse.server.preference.domain.model;

import java.time.Instant;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;
import lombok.experimental.Accessors;

/** User preference aggregate — framework-free domain model. */
@Getter
@Accessors(fluent = true)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public final class UserPreference {
  @NonNull private final UUID preferenceId;
  @NonNull private UUID customerId;
  private String theme;
  private String language;
  private boolean notificationsEnabled;
  @NonNull private Instant updatedAt;

  public static UserPreference create(
      UUID customerId, String theme, String language, boolean notificationsEnabled) {
    return new UserPreference(
        UUID.randomUUID(), customerId, theme, language, notificationsEnabled, Instant.now());
  }

  public static UserPreference rehydrate(
      UUID preferenceId,
      UUID customerId,
      String theme,
      String language,
      boolean notificationsEnabled,
      Instant updatedAt) {
    return new UserPreference(
        preferenceId,
        customerId,
        theme,
        language,
        notificationsEnabled,
        updatedAt == null ? Instant.now() : updatedAt);
  }

  public void update(
      @NonNull UUID customerId, String theme, String language, boolean notificationsEnabled) {
    this.customerId = customerId;
    this.theme = theme;
    this.language = language;
    this.notificationsEnabled = notificationsEnabled;
    this.updatedAt = Instant.now();
  }
}
