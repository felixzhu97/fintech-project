package com.finpulse.server.watchlist.controller;

import com.finpulse.server.watchlist.dto.WatchlistRequest;
import com.finpulse.server.watchlist.dto.WatchlistResponse;
import com.finpulse.server.watchlist.mapper.WatchlistMapper;
import com.finpulse.server.watchlist.service.WatchlistService;
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
@RequestMapping("/api/v1/watchlists")
@RequiredArgsConstructor
public class WatchlistController {
  private final WatchlistService service;
  private final WatchlistMapper mapper;

  @GetMapping
  public List<WatchlistResponse> list(
      @RequestParam(defaultValue = "100") int limit,
      @RequestParam(defaultValue = "0") int offset) {
    return service.list(limit, offset).stream().map(mapper::toResponse).toList();
  }

  @GetMapping("/{watchlist_id}")
  public WatchlistResponse get(@PathVariable("watchlist_id") UUID watchlistId) {
    return mapper.toResponse(service.getById(watchlistId));
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public WatchlistResponse create(@Valid @RequestBody WatchlistRequest request) {
    return mapper.toResponse(service.create(request));
  }

  @PostMapping("/batch")
  @ResponseStatus(HttpStatus.CREATED)
  public List<WatchlistResponse> createBatch(@Valid @RequestBody List<WatchlistRequest> requests) {
    return service.createBatch(requests).stream().map(mapper::toResponse).toList();
  }

  @PutMapping("/{watchlist_id}")
  public WatchlistResponse update(
      @PathVariable("watchlist_id") UUID watchlistId, @Valid @RequestBody WatchlistRequest request) {
    return mapper.toResponse(service.update(watchlistId, request));
  }

  @DeleteMapping("/{watchlist_id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable("watchlist_id") UUID watchlistId) {
    service.delete(watchlistId);
  }
}
