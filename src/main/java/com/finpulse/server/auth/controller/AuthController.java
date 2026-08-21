package com.finpulse.server.auth.controller;

import com.finpulse.server.auth.dto.ChangePasswordRequest;
import com.finpulse.server.auth.dto.CustomerResponse;
import com.finpulse.server.auth.dto.LoginRequest;
import com.finpulse.server.auth.dto.LoginResponse;
import com.finpulse.server.auth.dto.RegisterRequest;
import com.finpulse.server.auth.mapper.AuthMapper;
import com.finpulse.server.auth.service.AuthService;
import com.finpulse.server.auth.service.AuthService.AuthResult;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
  private final AuthService authService;
  private final AuthMapper authMapper;

  @PostMapping("/login")
  public LoginResponse login(@Valid @RequestBody LoginRequest request) {
    AuthResult result = authService.login(request);
    return authMapper.toLoginResponse(result.token(), result.customer());
  }

  @PostMapping("/register")
  @ResponseStatus(HttpStatus.CREATED)
  public LoginResponse register(@Valid @RequestBody RegisterRequest request) {
    AuthResult result = authService.register(request);
    return authMapper.toLoginResponse(result.token(), result.customer());
  }

  @GetMapping("/me")
  public CustomerResponse me(
      @RequestHeader(value = "Authorization", required = false) String authorization) {
    return authMapper.toCustomerResponse(authService.me(requireBearer(authorization)));
  }

  @PostMapping("/logout")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void logout(
      @RequestHeader(value = "Authorization", required = false) String authorization) {
    authService.logout(requireBearer(authorization));
  }

  @PostMapping("/change-password")
  public Map<String, Boolean> changePassword(
      @RequestHeader(value = "Authorization", required = false) String authorization,
      @Valid @RequestBody ChangePasswordRequest request) {
    authService.changePassword(requireBearer(authorization), request);
    return Map.of("ok", true);
  }

  private static String requireBearer(String authorization) {
    if (authorization == null || !authorization.startsWith("Bearer ")) {
      throw new ResponseStatusException(
          HttpStatus.UNAUTHORIZED, "Missing or invalid authorization");
    }
    return authorization.substring("Bearer ".length()).trim();
  }
}
