package com.finpulse.server.order.controller;

import com.finpulse.server.order.dto.TradeOrderRequest;
import com.finpulse.server.order.dto.TradeOrderResponse;
import com.finpulse.server.order.mapper.TradeOrderMapper;
import com.finpulse.server.order.service.TradeOrderService;
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
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class TradeOrderController {
  private final TradeOrderService service;
  private final TradeOrderMapper mapper;

  @GetMapping
  public List<TradeOrderResponse> list(@RequestParam(defaultValue = "100") int limit, @RequestParam(defaultValue = "0") int offset) {
    return service.list(limit, offset).stream().map(mapper::toResponse).toList();
  }
  @GetMapping("/{order_id}")
  public TradeOrderResponse get(@PathVariable("order_id") UUID id) { return mapper.toResponse(service.getById(id)); }
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public TradeOrderResponse create(@Valid @RequestBody TradeOrderRequest request) { return mapper.toResponse(service.create(request)); }
  @PostMapping("/batch")
  @ResponseStatus(HttpStatus.CREATED)
  public List<TradeOrderResponse> createBatch(@Valid @RequestBody List<TradeOrderRequest> requests) {
    return service.createBatch(requests).stream().map(mapper::toResponse).toList();
  }
  @PutMapping("/{order_id}")
  public TradeOrderResponse update(@PathVariable("order_id") UUID id, @Valid @RequestBody TradeOrderRequest request) {
    return mapper.toResponse(service.update(id, request));
  }
  @DeleteMapping("/{order_id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable("order_id") UUID id) { service.delete(id); }
}
