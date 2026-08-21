package com.finpulse.server.preference.controller;

import com.finpulse.server.preference.dto.UserPreferenceRequest;
import com.finpulse.server.preference.dto.UserPreferenceResponse;
import com.finpulse.server.preference.mapper.UserPreferenceMapper;
import com.finpulse.server.preference.service.UserPreferenceService;
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
@RequestMapping("/api/v1/user-preferences")
@RequiredArgsConstructor
public class UserPreferenceController {
  private final UserPreferenceService service;
  private final UserPreferenceMapper mapper;

  @GetMapping
  public List<UserPreferenceResponse> list(
      @RequestParam(defaultValue = "100") int limit,
      @RequestParam(defaultValue = "0") int offset) {
    return service.list(limit, offset).stream().map(mapper::toResponse).toList();
  }

  @GetMapping("/{preferenceId}")
  public UserPreferenceResponse get(@PathVariable UUID preferenceId) {
    return mapper.toResponse(service.getById(preferenceId));
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public UserPreferenceResponse create(@Valid @RequestBody UserPreferenceRequest request) {
    return mapper.toResponse(service.create(request));
  }

  @PostMapping("/batch")
  @ResponseStatus(HttpStatus.CREATED)
  public List<UserPreferenceResponse> createBatch(
      @Valid @RequestBody List<UserPreferenceRequest> requests) {
    return service.createBatch(requests).stream().map(mapper::toResponse).toList();
  }

  @PutMapping("/{preferenceId}")
  public UserPreferenceResponse update(
      @PathVariable UUID preferenceId, @Valid @RequestBody UserPreferenceRequest request) {
    return mapper.toResponse(service.update(preferenceId, request));
  }

  @DeleteMapping("/{preferenceId}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable UUID preferenceId) {
    service.delete(preferenceId);
  }
}
