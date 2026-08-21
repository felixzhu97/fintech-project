package com.finpulse.server.marketdata.controller;

import com.finpulse.server.marketdata.dto.MarketDataRequest;
import com.finpulse.server.marketdata.dto.MarketDataResponse;
import com.finpulse.server.marketdata.mapper.MarketDataMapper;
import com.finpulse.server.marketdata.service.MarketDataService;
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
@RequestMapping("/api/v1/market-data")
@RequiredArgsConstructor
public class MarketDataController {
  private final MarketDataService service;
  private final MarketDataMapper mapper;

  @GetMapping
  public List<MarketDataResponse> list(
      @RequestParam(defaultValue = "100") int limit,
      @RequestParam(defaultValue = "0") int offset) {
    return service.list(limit, offset).stream().map(mapper::toResponse).toList();
  }

  @GetMapping("/{data_id}")
  public MarketDataResponse get(@PathVariable("data_id") UUID dataId) {
    return mapper.toResponse(service.getById(dataId));
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public MarketDataResponse create(@Valid @RequestBody MarketDataRequest request) {
    return mapper.toResponse(service.create(request));
  }

  @PostMapping("/batch")
  @ResponseStatus(HttpStatus.CREATED)
  public List<MarketDataResponse> createBatch(@Valid @RequestBody List<MarketDataRequest> requests) {
    return service.createBatch(requests).stream().map(mapper::toResponse).toList();
  }

  @PutMapping("/{data_id}")
  public MarketDataResponse update(
      @PathVariable("data_id") UUID dataId, @Valid @RequestBody MarketDataRequest request) {
    return mapper.toResponse(service.update(dataId, request));
  }

  @DeleteMapping("/{data_id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable("data_id") UUID dataId) {
    service.delete(dataId);
  }
}
