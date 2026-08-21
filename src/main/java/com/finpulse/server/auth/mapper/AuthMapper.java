package com.finpulse.server.auth.mapper;

import com.finpulse.server.auth.dto.CustomerResponse;
import com.finpulse.server.auth.dto.LoginResponse;
import com.finpulse.server.customer.domain.model.Customer;
import org.springframework.stereotype.Component;

@Component
public class AuthMapper {
  public CustomerResponse toCustomerResponse(Customer customer) {
    return CustomerResponse.builder()
        .customerId(customer.customerId())
        .name(customer.name())
        .email(customer.email())
        .kycStatus(customer.kycStatus())
        .createdAt(customer.createdAt())
        .build();
  }

  public LoginResponse toLoginResponse(String token, Customer customer) {
    return LoginResponse.builder().token(token).customer(toCustomerResponse(customer)).build();
  }
}
