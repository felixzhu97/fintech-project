package com.finpulse.server.watchlistitem.mapper;

import com.finpulse.server.watchlistitem.domain.model.WatchlistItem;
import com.finpulse.server.watchlistitem.dto.WatchlistItemRequest;
import com.finpulse.server.watchlistitem.dto.WatchlistItemResponse;
import org.springframework.stereotype.Component;

@Component
public class WatchlistItemMapper {
  public WatchlistItem toDomain(WatchlistItemRequest request) {
    return WatchlistItem.create(request.getWatchlistId(), request.getInstrumentId());
  }

  public void apply(WatchlistItemRequest request, WatchlistItem item) {
    item.update(request.getWatchlistId(), request.getInstrumentId());
  }

  public WatchlistItemResponse toResponse(WatchlistItem item) {
    return WatchlistItemResponse.builder()
        .watchlistItemId(item.watchlistItemId())
        .watchlistId(item.watchlistId())
        .instrumentId(item.instrumentId())
        .addedAt(item.addedAt())
        .build();
  }
}
