package com.finpulse.server.trade.controller;

import com.finpulse.server.trade.dto.TradeRequest;
import com.finpulse.server.trade.dto.TradeResponse;
import com.finpulse.server.trade.mapper.TradeMapper;
import com.finpulse.server.trade.service.TradeService;
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
@RequestMapping("/api/v1/trades")
@RequiredArgsConstructor
public class TradeController {
  private final TradeService service;
  private final TradeMapper mapper;

  @GetMapping
  public List<TradeResponse> list(@RequestParam(defaultValue = "100") int limit, @RequestParam(defaultValue = "0") int offset) {
    return service.list(limit, offset).stream().map(mapper::toResponse).toList();
  }
  @GetMapping("/{trade_id}")
  public TradeResponse get(@PathVariable("trade_id") UUID id) { return mapper.toResponse(service.getById(id)); }
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public TradeResponse create(@Valid @RequestBody TradeRequest request) { return mapper.toResponse(service.create(request)); }
  @PostMapping("/batch")
  @ResponseStatus(HttpStatus.CREATED)
  public List<TradeResponse> createBatch(@Valid @RequestBody List<TradeRequest> requests) {
    return service.createBatch(requests).stream().map(mapper::toResponse).toList();
  }
  @PutMapping("/{trade_id}")
  public TradeResponse update(@PathVariable("trade_id") UUID id, @Valid @RequestBody TradeRequest request) {
    return mapper.toResponse(service.update(id, request));
  }
  @DeleteMapping("/{trade_id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable("trade_id") UUID id) { service.delete(id); }
}
