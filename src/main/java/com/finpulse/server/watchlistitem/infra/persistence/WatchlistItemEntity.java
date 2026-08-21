package com.finpulse.server.watchlistitem.infra.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "watchlist_item")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class WatchlistItemEntity {
  @Id
  @Column(name = "watchlist_item_id", nullable = false, updatable = false)
  @Setter(AccessLevel.NONE)
  private UUID watchlistItemId;

  @Column(name = "watchlist_id", nullable = false)
  private UUID watchlistId;

  @Column(name = "instrument_id", nullable = false)
  private UUID instrumentId;

  @Column(name = "added_at", nullable = false)
  @Setter(AccessLevel.NONE)
  private Instant addedAt;

  @PrePersist
  void onCreate() {
    if (watchlistItemId == null) {
      watchlistItemId = UUID.randomUUID();
    }
    if (addedAt == null) {
      addedAt = Instant.now();
    }
  }
}
