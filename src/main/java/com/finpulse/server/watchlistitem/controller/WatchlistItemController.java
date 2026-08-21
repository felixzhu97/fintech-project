package com.finpulse.server.watchlistitem.controller;

import com.finpulse.server.watchlistitem.dto.WatchlistItemRequest;
import com.finpulse.server.watchlistitem.dto.WatchlistItemResponse;
import com.finpulse.server.watchlistitem.mapper.WatchlistItemMapper;
import com.finpulse.server.watchlistitem.service.WatchlistItemService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/watchlist-items")
@RequiredArgsConstructor
public class WatchlistItemController {
  private final WatchlistItemService service;
  private final WatchlistItemMapper mapper;

  @GetMapping
  public List<WatchlistItemResponse> list(
      @RequestParam(defaultValue = "100") int limit,
      @RequestParam(defaultValue = "0") int offset) {
    return service.list(limit, offset).stream().map(mapper::toResponse).toList();
  }

  @GetMapping("/{watchlist_item_id}")
  public WatchlistItemResponse get(@PathVariable("watchlist_item_id") UUID watchlistItemId) {
    return mapper.toResponse(service.getById(watchlistItemId));
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public WatchlistItemResponse create(@Valid @RequestBody WatchlistItemRequest request) {
    return mapper.toResponse(service.create(request));
  }

  @PostMapping("/batch")
  @ResponseStatus(HttpStatus.CREATED)
  public List<WatchlistItemResponse> createBatch(
      @Valid @RequestBody List<WatchlistItemRequest> requests) {
    return service.createBatch(requests).stream().map(mapper::toResponse).toList();
  }

  @PutMapping("/{watchlist_item_id}")
  public WatchlistItemResponse update(
      @PathVariable("watchlist_item_id") UUID watchlistItemId,
      @Valid @RequestBody WatchlistItemRequest request) {
    return mapper.toResponse(service.update(watchlistItemId, request));
  }

  @DeleteMapping("/{watchlist_item_id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable("watchlist_item_id") UUID watchlistItemId) {
    service.delete(watchlistItemId);
  }
}
