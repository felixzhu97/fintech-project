package com.finpulse.server.watchlistitem.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Value
@Builder
@Jacksonized
public class WatchlistItemRequest {
  @NotNull UUID watchlistId;
  @NotNull UUID instrumentId;
}
