package com.finpulse.server.customer.controller;

import com.finpulse.server.customer.dto.CustomerRequest;
import com.finpulse.server.customer.dto.CustomerResponse;
import com.finpulse.server.customer.mapper.CustomerMapper;
import com.finpulse.server.customer.service.CustomerService;
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
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
public class CustomerController {
  private final CustomerService service;
  private final CustomerMapper mapper;

  @GetMapping
  public List<CustomerResponse> list(
      @RequestParam(defaultValue = "100") int limit,
      @RequestParam(defaultValue = "0") int offset) {
    return service.list(limit, offset).stream().map(mapper::toResponse).toList();
  }

  @GetMapping("/{customer_id}")
  public CustomerResponse get(@PathVariable("customer_id") UUID customerId) {
    return mapper.toResponse(service.getById(customerId));
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public CustomerResponse create(@Valid @RequestBody CustomerRequest request) {
    return mapper.toResponse(service.create(request));
  }

  @PostMapping("/batch")
  @ResponseStatus(HttpStatus.CREATED)
  public List<CustomerResponse> createBatch(@Valid @RequestBody List<CustomerRequest> requests) {
    return service.createBatch(requests).stream().map(mapper::toResponse).toList();
  }

  @PutMapping("/{customer_id}")
  public CustomerResponse update(
      @PathVariable("customer_id") UUID customerId, @Valid @RequestBody CustomerRequest request) {
    return mapper.toResponse(service.update(customerId, request));
  }

  @DeleteMapping("/{customer_id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable("customer_id") UUID customerId) {
    service.delete(customerId);
  }
}
