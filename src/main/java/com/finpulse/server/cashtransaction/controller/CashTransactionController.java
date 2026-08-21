package com.finpulse.server.cashtransaction.controller;

import com.finpulse.server.cashtransaction.dto.CashTransactionRequest;
import com.finpulse.server.cashtransaction.dto.CashTransactionResponse;
import com.finpulse.server.cashtransaction.mapper.CashTransactionMapper;
import com.finpulse.server.cashtransaction.service.CashTransactionService;
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
@RequestMapping("/api/v1/cash-transactions")
@RequiredArgsConstructor
public class CashTransactionController {
  private final CashTransactionService service;
  private final CashTransactionMapper mapper;

  @GetMapping
  public List<CashTransactionResponse> list(@RequestParam(defaultValue = "100") int limit, @RequestParam(defaultValue = "0") int offset) {
    return service.list(limit, offset).stream().map(mapper::toResponse).toList();
  }
  @GetMapping("/{transaction_id}")
  public CashTransactionResponse get(@PathVariable("transaction_id") UUID id) { return mapper.toResponse(service.getById(id)); }
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public CashTransactionResponse create(@Valid @RequestBody CashTransactionRequest request) { return mapper.toResponse(service.create(request)); }
  @PostMapping("/batch")
  @ResponseStatus(HttpStatus.CREATED)
  public List<CashTransactionResponse> createBatch(@Valid @RequestBody List<CashTransactionRequest> requests) {
    return service.createBatch(requests).stream().map(mapper::toResponse).toList();
  }
  @PutMapping("/{transaction_id}")
  public CashTransactionResponse update(@PathVariable("transaction_id") UUID id, @Valid @RequestBody CashTransactionRequest request) {
    return mapper.toResponse(service.update(id, request));
  }
  @DeleteMapping("/{transaction_id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable("transaction_id") UUID id) { service.delete(id); }
}
