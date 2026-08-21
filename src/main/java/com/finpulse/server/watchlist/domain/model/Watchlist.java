package com.finpulse.server.watchlist.domain.model;

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
public final class Watchlist {
  @NonNull private final UUID watchlistId;
  @NonNull private UUID customerId;
  @NonNull private String name;
  @NonNull private final Instant createdAt;

  public static Watchlist create(UUID customerId, String name) {
    return new Watchlist(UUID.randomUUID(), customerId, name, Instant.now());
  }

  public static Watchlist rehydrate(
      UUID watchlistId, UUID customerId, String name, Instant createdAt) {
    return new Watchlist(watchlistId, customerId, name, createdAt);
  }

  public void update(@NonNull UUID customerId, @NonNull String name) {
    this.customerId = customerId;
    this.name = name;
  }
}
