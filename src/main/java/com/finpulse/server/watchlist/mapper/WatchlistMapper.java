package com.finpulse.server.watchlist.mapper;

import com.finpulse.server.watchlist.domain.model.Watchlist;
import com.finpulse.server.watchlist.dto.WatchlistRequest;
import com.finpulse.server.watchlist.dto.WatchlistResponse;
import org.springframework.stereotype.Component;

@Component
public class WatchlistMapper {
  public Watchlist toDomain(WatchlistRequest request) {
    return Watchlist.create(request.getCustomerId(), request.getName());
  }

  public void apply(WatchlistRequest request, Watchlist watchlist) {
    watchlist.update(request.getCustomerId(), request.getName());
  }

  public WatchlistResponse toResponse(Watchlist watchlist) {
    return WatchlistResponse.builder()
        .watchlistId(watchlist.watchlistId())
        .customerId(watchlist.customerId())
        .name(watchlist.name())
        .createdAt(watchlist.createdAt())
        .build();
  }
}
