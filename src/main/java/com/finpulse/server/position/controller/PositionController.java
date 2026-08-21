package com.finpulse.server.position.controller;

import com.finpulse.server.position.dto.PositionRequest;
import com.finpulse.server.position.dto.PositionResponse;
import com.finpulse.server.position.mapper.PositionMapper;
import com.finpulse.server.position.service.PositionService;
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
@RequestMapping("/api/v1/positions")
@RequiredArgsConstructor
public class PositionController {
  private final PositionService service;
  private final PositionMapper mapper;

  @GetMapping
  public List<PositionResponse> list(@RequestParam(defaultValue = "100") int limit, @RequestParam(defaultValue = "0") int offset) {
    return service.list(limit, offset).stream().map(mapper::toResponse).toList();
  }
  @GetMapping("/{position_id}")
  public PositionResponse get(@PathVariable("position_id") UUID id) { return mapper.toResponse(service.getById(id)); }
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public PositionResponse create(@Valid @RequestBody PositionRequest request) { return mapper.toResponse(service.create(request)); }
  @PostMapping("/batch")
  @ResponseStatus(HttpStatus.CREATED)
  public List<PositionResponse> createBatch(@Valid @RequestBody List<PositionRequest> requests) {
    return service.createBatch(requests).stream().map(mapper::toResponse).toList();
  }
  @PutMapping("/{position_id}")
  public PositionResponse update(@PathVariable("position_id") UUID id, @Valid @RequestBody PositionRequest request) {
    return mapper.toResponse(service.update(id, request));
  }
  @DeleteMapping("/{position_id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable("position_id") UUID id) { service.delete(id); }
}
