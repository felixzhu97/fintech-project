package com.finpulse.server.customer.mapper;

import com.finpulse.server.customer.domain.model.Customer;
import com.finpulse.server.customer.dto.CustomerRequest;
import com.finpulse.server.customer.dto.CustomerResponse;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper {
  public Customer toDomain(CustomerRequest request) {
    return Customer.create(request.getName(), request.getEmail(), request.getKycStatus());
  }

  public void apply(CustomerRequest request, Customer customer) {
    customer.update(request.getName(), request.getEmail(), request.getKycStatus());
  }

  public CustomerResponse toResponse(Customer customer) {
    return CustomerResponse.builder()
        .customerId(customer.customerId())
        .name(customer.name())
        .email(customer.email())
        .kycStatus(customer.kycStatus())
        .createdAt(customer.createdAt())
        .build();
  }
}
