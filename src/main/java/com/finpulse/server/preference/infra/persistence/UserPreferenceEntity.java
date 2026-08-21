package com.finpulse.server.preference.infra.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import java.time.Instant;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class UserPreferenceEntity {

  @Id
  @Column(name = "preference_id", nullable = false, updatable = false)
  @Setter(AccessLevel.NONE)
  private UUID preferenceId;

  @Column(name = "customer_id", nullable = false)
  private UUID customerId;

  @Column(name = "theme")
  private String theme;

  @Column(name = "language")
  private String language;

  @Column(name = "notifications_enabled", nullable = false)
  private boolean notificationsEnabled;

  @Column(name = "updated_at", nullable = false)
  @Setter(AccessLevel.NONE)
  private Instant updatedAt;

  @PrePersist
  void onCreate() {
    if (preferenceId == null) {
      preferenceId = UUID.randomUUID();
    }
    updatedAt = Instant.now();
  }

  @PreUpdate
  void onUpdate() {
    updatedAt = Instant.now();
  }
}
