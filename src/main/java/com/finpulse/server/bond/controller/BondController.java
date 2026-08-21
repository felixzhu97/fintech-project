package com.finpulse.server.bond.controller;

import com.finpulse.server.bond.dto.BondRequest;
import com.finpulse.server.bond.dto.BondResponse;
import com.finpulse.server.bond.mapper.BondMapper;
import com.finpulse.server.bond.service.BondService;
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
@RequestMapping("/api/v1/bonds")
@RequiredArgsConstructor
public class BondController {
  private final BondService service;
  private final BondMapper mapper;

  @GetMapping
  public List<BondResponse> list(
      @RequestParam(defaultValue = "100") int limit,
      @RequestParam(defaultValue = "0") int offset) {
    return service.list(limit, offset).stream().map(mapper::toResponse).toList();
  }

  @GetMapping("/{bond_id}")
  public BondResponse get(@PathVariable("bond_id") UUID id) {
    return mapper.toResponse(service.getById(id));
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public BondResponse create(@Valid @RequestBody BondRequest request) {
    return mapper.toResponse(service.create(request));
  }

  @PostMapping("/batch")
  @ResponseStatus(HttpStatus.CREATED)
  public List<BondResponse> createBatch(@Valid @RequestBody List<BondRequest> requests) {
    return service.createBatch(requests).stream().map(mapper::toResponse).toList();
  }

  @PutMapping("/{bond_id}")
  public BondResponse update(
      @PathVariable("bond_id") UUID id, @Valid @RequestBody BondRequest request) {
    return mapper.toResponse(service.update(id, request));
  }

  @DeleteMapping("/{bond_id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable("bond_id") UUID id) {
    service.delete(id);
  }
}
