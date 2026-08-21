package com.finpulse.server.option.controller;

import com.finpulse.server.option.dto.OptionRequest;
import com.finpulse.server.option.dto.OptionResponse;
import com.finpulse.server.option.mapper.OptionMapper;
import com.finpulse.server.option.service.OptionService;
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
@RequestMapping("/api/v1/options")
@RequiredArgsConstructor
public class OptionController {
  private final OptionService service;
  private final OptionMapper mapper;

  @GetMapping
  public List<OptionResponse> list(
      @RequestParam(defaultValue = "100") int limit,
      @RequestParam(defaultValue = "0") int offset) {
    return service.list(limit, offset).stream().map(mapper::toResponse).toList();
  }

  @GetMapping("/{option_id}")
  public OptionResponse get(@PathVariable("option_id") UUID optionId) {
    return mapper.toResponse(service.getById(optionId));
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public OptionResponse create(@Valid @RequestBody OptionRequest request) {
    return mapper.toResponse(service.create(request));
  }

  @PostMapping("/batch")
  @ResponseStatus(HttpStatus.CREATED)
  public List<OptionResponse> createBatch(@Valid @RequestBody List<OptionRequest> requests) {
    return service.createBatch(requests).stream().map(mapper::toResponse).toList();
  }

  @PutMapping("/{option_id}")
  public OptionResponse update(
      @PathVariable("option_id") UUID optionId, @Valid @RequestBody OptionRequest request) {
    return mapper.toResponse(service.update(optionId, request));
  }

  @DeleteMapping("/{option_id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable("option_id") UUID optionId) {
    service.delete(optionId);
  }
}
