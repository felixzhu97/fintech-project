package com.finpulse.server.account.controller;

import com.finpulse.server.account.dto.AccountRequest;
import com.finpulse.server.account.dto.AccountResponse;
import com.finpulse.server.account.mapper.AccountMapper;
import com.finpulse.server.account.service.AccountService;
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
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
public class AccountController {
  private final AccountService service;
  private final AccountMapper mapper;

  @GetMapping
  public List<AccountResponse> list(
      @RequestParam(defaultValue = "100") int limit,
      @RequestParam(defaultValue = "0") int offset) {
    return service.list(limit, offset).stream().map(mapper::toResponse).toList();
  }

  @GetMapping("/{account_id}")
  public AccountResponse get(@PathVariable("account_id") UUID accountId) {
    return mapper.toResponse(service.getById(accountId));
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public AccountResponse create(@Valid @RequestBody AccountRequest request) {
    return mapper.toResponse(service.create(request));
  }

  @PostMapping("/batch")
  @ResponseStatus(HttpStatus.CREATED)
  public List<AccountResponse> createBatch(@Valid @RequestBody List<AccountRequest> requests) {
    return service.createBatch(requests).stream().map(mapper::toResponse).toList();
  }

  @PutMapping("/{account_id}")
  public AccountResponse update(
      @PathVariable("account_id") UUID accountId, @Valid @RequestBody AccountRequest request) {
    return mapper.toResponse(service.update(accountId, request));
  }

  @DeleteMapping("/{account_id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable("account_id") UUID accountId) {
    service.delete(accountId);
  }
}
