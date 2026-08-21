package com.finpulse.server.watchlistitem.dto;

import java.time.Instant;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
public class WatchlistItemResponse {
  UUID watchlistItemId;
  UUID watchlistId;
  UUID instrumentId;
  Instant addedAt;
}
