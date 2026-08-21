package com.finpulse.server.instrument.controller;

import com.finpulse.server.instrument.dto.InstrumentRequest;
import com.finpulse.server.instrument.dto.InstrumentResponse;
import com.finpulse.server.instrument.mapper.InstrumentMapper;
import com.finpulse.server.instrument.service.InstrumentService;
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
@RequestMapping("/api/v1/instruments")
@RequiredArgsConstructor
public class InstrumentController {
  private final InstrumentService service;
  private final InstrumentMapper mapper;

  @GetMapping
  public List<InstrumentResponse> list(
      @RequestParam(defaultValue = "100") int limit,
      @RequestParam(defaultValue = "0") int offset) {
    return service.list(limit, offset).stream().map(mapper::toResponse).toList();
  }

  @GetMapping("/{instrument_id}")
  public InstrumentResponse get(@PathVariable("instrument_id") UUID id) {
    return mapper.toResponse(service.getById(id));
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public InstrumentResponse create(@Valid @RequestBody InstrumentRequest request) {
    return mapper.toResponse(service.create(request));
  }

  @PostMapping("/batch")
  @ResponseStatus(HttpStatus.CREATED)
  public List<InstrumentResponse> createBatch(@Valid @RequestBody List<InstrumentRequest> requests) {
    return service.createBatch(requests).stream().map(mapper::toResponse).toList();
  }

  @PutMapping("/{instrument_id}")
  public InstrumentResponse update(
      @PathVariable("instrument_id") UUID id, @Valid @RequestBody InstrumentRequest request) {
    return mapper.toResponse(service.update(id, request));
  }

  @DeleteMapping("/{instrument_id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable("instrument_id") UUID id) {
    service.delete(id);
  }
}
