package com.finpulse.server.auth.service;

import com.finpulse.server.auth.domain.model.Session;
import com.finpulse.server.auth.domain.model.UserCredential;
import com.finpulse.server.auth.domain.repository.AuthRepository;
import com.finpulse.server.auth.dto.ChangePasswordRequest;
import com.finpulse.server.auth.dto.LoginRequest;
import com.finpulse.server.auth.dto.RegisterRequest;
import com.finpulse.server.customer.domain.model.Customer;
import com.finpulse.server.customer.domain.repository.CustomerRepository;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Locale;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {
  private static final int SESSION_DAYS = 7;

  private final AuthRepository authRepository;
  private final CustomerRepository customerRepository;
  private final BCryptPasswordEncoder passwordEncoder;
  private final SecureRandom secureRandom = new SecureRandom();

  public record AuthResult(String token, Customer customer) {}

  public AuthResult login(LoginRequest request) {
    String email = normalizeEmail(request.getEmail());
    UserCredential credential =
        authRepository.findCredentialByEmail(email).orElseThrow(this::invalidCredentials);
    if (!passwordEncoder.matches(request.getPassword(), credential.passwordHash())) {
      throw invalidCredentials();
    }
    Customer customer =
        customerRepository.findById(credential.customerId()).orElseThrow(this::invalidCredentials);
    return new AuthResult(createSessionToken(customer.customerId()), customer);
  }

  public AuthResult register(RegisterRequest request) {
    String email = normalizeEmail(request.getEmail());
    if (authRepository.findCredentialByEmail(email).isPresent()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already registered");
    }
    Customer customer = customerRepository.save(Customer.create(request.getName().trim(), email));
    authRepository.saveCredential(
        UserCredential.create(customer.customerId(), email, passwordEncoder.encode(request.getPassword())));
    return new AuthResult(createSessionToken(customer.customerId()), customer);
  }

  @Transactional(readOnly = true)
  public Customer me(String token) {
    return customerForToken(token);
  }

  public void logout(String token) {
    authRepository.deleteSessionByToken(token);
  }

  public void changePassword(String token, ChangePasswordRequest request) {
    Customer customer = customerForToken(token);
    UserCredential credential =
        authRepository
            .findCredentialByCustomerId(customer.customerId())
            .orElseThrow(this::invalidCredentials);
    if (!passwordEncoder.matches(request.getCurrentPassword(), credential.passwordHash())) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Current password is incorrect");
    }
    credential.updatePasswordHash(passwordEncoder.encode(request.getNewPassword()));
    authRepository.saveCredential(credential);
  }

  private Customer customerForToken(String token) {
    Session session =
        authRepository
            .findSessionByToken(token)
            .orElseThrow(
                () ->
                    new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid or expired session"));
    if (session.isExpired()) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired session");
    }
    return customerRepository
        .findById(session.customerId())
        .orElseThrow(
            () ->
                new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired session"));
  }

  private String createSessionToken(UUID customerId) {
    byte[] bytes = new byte[32];
    secureRandom.nextBytes(bytes);
    String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    Instant expires = Instant.now().plus(SESSION_DAYS, ChronoUnit.DAYS);
    authRepository.saveSession(Session.create(customerId, token, expires));
    return token;
  }

  private static String normalizeEmail(String email) {
    return email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
  }

  private ResponseStatusException invalidCredentials() {
    return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
  }
}
