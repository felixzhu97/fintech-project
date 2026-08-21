package com.finpulse.server.settlement.controller;

import com.finpulse.server.settlement.dto.SettlementRequest;
import com.finpulse.server.settlement.dto.SettlementResponse;
import com.finpulse.server.settlement.mapper.SettlementMapper;
import com.finpulse.server.settlement.service.SettlementService;
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
@RequestMapping("/api/v1/settlements")
@RequiredArgsConstructor
public class SettlementController {
  private final SettlementService service;
  private final SettlementMapper mapper;

  @GetMapping
  public List<SettlementResponse> list(@RequestParam(defaultValue = "100") int limit, @RequestParam(defaultValue = "0") int offset) {
    return service.list(limit, offset).stream().map(mapper::toResponse).toList();
  }
  @GetMapping("/{settlement_id}")
  public SettlementResponse get(@PathVariable("settlement_id") UUID id) { return mapper.toResponse(service.getById(id)); }
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public SettlementResponse create(@Valid @RequestBody SettlementRequest request) { return mapper.toResponse(service.create(request)); }
  @PostMapping("/batch")
  @ResponseStatus(HttpStatus.CREATED)
  public List<SettlementResponse> createBatch(@Valid @RequestBody List<SettlementRequest> requests) {
    return service.createBatch(requests).stream().map(mapper::toResponse).toList();
  }
  @PutMapping("/{settlement_id}")
  public SettlementResponse update(@PathVariable("settlement_id") UUID id, @Valid @RequestBody SettlementRequest request) {
    return mapper.toResponse(service.update(id, request));
  }
  @DeleteMapping("/{settlement_id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable("settlement_id") UUID id) { service.delete(id); }
}
