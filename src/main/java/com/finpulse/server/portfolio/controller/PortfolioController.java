package com.finpulse.server.portfolio.controller;

import com.finpulse.server.portfolio.dto.PortfolioRequest;
import com.finpulse.server.portfolio.dto.PortfolioResponse;
import com.finpulse.server.portfolio.mapper.PortfolioMapper;
import com.finpulse.server.portfolio.service.PortfolioService;
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
@RequestMapping("/api/v1/portfolios")
@RequiredArgsConstructor
public class PortfolioController {
  private final PortfolioService service;
  private final PortfolioMapper mapper;

  @GetMapping
  public List<PortfolioResponse> list(@RequestParam(defaultValue = "100") int limit, @RequestParam(defaultValue = "0") int offset) {
    return service.list(limit, offset).stream().map(mapper::toResponse).toList();
  }
  @GetMapping("/{portfolio_id}")
  public PortfolioResponse get(@PathVariable("portfolio_id") UUID id) { return mapper.toResponse(service.getById(id)); }
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public PortfolioResponse create(@Valid @RequestBody PortfolioRequest request) { return mapper.toResponse(service.create(request)); }
  @PostMapping("/batch")
  @ResponseStatus(HttpStatus.CREATED)
  public List<PortfolioResponse> createBatch(@Valid @RequestBody List<PortfolioRequest> requests) {
    return service.createBatch(requests).stream().map(mapper::toResponse).toList();
  }
  @PutMapping("/{portfolio_id}")
  public PortfolioResponse update(@PathVariable("portfolio_id") UUID id, @Valid @RequestBody PortfolioRequest request) {
    return mapper.toResponse(service.update(id, request));
  }
  @DeleteMapping("/{portfolio_id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable("portfolio_id") UUID id) { service.delete(id); }
}
