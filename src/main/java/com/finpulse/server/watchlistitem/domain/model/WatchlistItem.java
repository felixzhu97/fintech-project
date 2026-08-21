package com.finpulse.server.watchlistitem.domain.model;

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
public final class WatchlistItem {
  @NonNull private final UUID watchlistItemId;
  @NonNull private UUID watchlistId;
  @NonNull private UUID instrumentId;
  @NonNull private final Instant addedAt;

  public static WatchlistItem create(UUID watchlistId, UUID instrumentId) {
    return new WatchlistItem(UUID.randomUUID(), watchlistId, instrumentId, Instant.now());
  }

  public static WatchlistItem rehydrate(
      UUID watchlistItemId, UUID watchlistId, UUID instrumentId, Instant addedAt) {
    return new WatchlistItem(watchlistItemId, watchlistId, instrumentId, addedAt);
  }

  public void update(@NonNull UUID watchlistId, @NonNull UUID instrumentId) {
    this.watchlistId = watchlistId;
    this.instrumentId = instrumentId;
  }
}
