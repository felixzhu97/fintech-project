package com.finpulse.server.preference.domain.model;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

/** User preference aggregate — framework-free domain model. */
public final class UserPreference {
  private final UUID preferenceId;
  private UUID customerId;
  private String theme;
  private String language;
  private boolean notificationsEnabled;
  private Instant updatedAt;

  private UserPreference(
      UUID preferenceId,
      UUID customerId,
      String theme,
      String language,
      boolean notificationsEnabled,
      Instant updatedAt) {
    this.preferenceId = Objects.requireNonNull(preferenceId, "preferenceId");
    this.customerId = Objects.requireNonNull(customerId, "customerId");
    this.theme = theme;
    this.language = language;
    this.notificationsEnabled = notificationsEnabled;
    this.updatedAt = updatedAt == null ? Instant.now() : updatedAt;
  }

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
        preferenceId, customerId, theme, language, notificationsEnabled, updatedAt);
  }

  public void update(
      UUID customerId, String theme, String language, boolean notificationsEnabled) {
    this.customerId = Objects.requireNonNull(customerId, "customerId");
    this.theme = theme;
    this.language = language;
    this.notificationsEnabled = notificationsEnabled;
    this.updatedAt = Instant.now();
  }

  public UUID preferenceId() {
    return preferenceId;
  }

  public UUID customerId() {
    return customerId;
  }

  public String theme() {
    return theme;
  }

  public String language() {
    return language;
  }

  public boolean notificationsEnabled() {
    return notificationsEnabled;
  }

  public Instant updatedAt() {
    return updatedAt;
  }
}
