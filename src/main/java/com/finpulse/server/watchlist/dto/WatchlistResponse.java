package com.finpulse.server.watchlist.dto;

import java.time.Instant;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
public class WatchlistResponse {
  UUID watchlistId;
  UUID customerId;
  String name;
  Instant createdAt;
}
