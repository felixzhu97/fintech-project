package com.finpulse.server.payment.controller;

import com.finpulse.server.payment.dto.PaymentRequest;
import com.finpulse.server.payment.dto.PaymentResponse;
import com.finpulse.server.payment.mapper.PaymentMapper;
import com.finpulse.server.payment.service.PaymentService;
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
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {
  private final PaymentService service;
  private final PaymentMapper mapper;

  @GetMapping
  public List<PaymentResponse> list(@RequestParam(defaultValue = "100") int limit, @RequestParam(defaultValue = "0") int offset) {
    return service.list(limit, offset).stream().map(mapper::toResponse).toList();
  }
  @GetMapping("/{payment_id}")
  public PaymentResponse get(@PathVariable("payment_id") UUID id) { return mapper.toResponse(service.getById(id)); }
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public PaymentResponse create(@Valid @RequestBody PaymentRequest request) { return mapper.toResponse(service.create(request)); }
  @PostMapping("/batch")
  @ResponseStatus(HttpStatus.CREATED)
  public List<PaymentResponse> createBatch(@Valid @RequestBody List<PaymentRequest> requests) {
    return service.createBatch(requests).stream().map(mapper::toResponse).toList();
  }
  @PutMapping("/{payment_id}")
  public PaymentResponse update(@PathVariable("payment_id") UUID id, @Valid @RequestBody PaymentRequest request) {
    return mapper.toResponse(service.update(id, request));
  }
  @DeleteMapping("/{payment_id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable("payment_id") UUID id) { service.delete(id); }
}
