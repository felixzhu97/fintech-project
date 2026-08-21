package com.finpulse.server.auth.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.finpulse.server.auth.dto.LoginRequest;
import com.finpulse.server.auth.dto.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

  @Autowired private MockMvc mockMvc;
  @Autowired private ObjectMapper objectMapper;

  @Test
  void shouldRegisterLoginAndReturnMeWhenCredentialsValid() throws Exception {
    RegisterRequest register =
        RegisterRequest.builder()
            .name("Ada")
            .email("ada@example.com")
            .password("secret123")
            .build();
    MvcResult created =
        mockMvc
            .perform(
                post("/api/v1/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(register)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.token").isNotEmpty())
            .andExpect(jsonPath("$.customer.email").value("ada@example.com"))
            .andReturn();

    String token =
        com.jayway.jsonpath.JsonPath.read(created.getResponse().getContentAsString(), "$.token");

    mockMvc
        .perform(get("/api/v1/auth/me").header("Authorization", "Bearer " + token))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name").value("Ada"));

    LoginRequest login =
        LoginRequest.builder().email("ada@example.com").password("secret123").build();
    mockMvc
        .perform(
            post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(login)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.token").isNotEmpty());
  }

  @Test
  void shouldRejectLoginWhenPasswordWrong() throws Exception {
    RegisterRequest register =
        RegisterRequest.builder()
            .name("Bob")
            .email("bob@example.com")
            .password("secret123")
            .build();
    mockMvc
        .perform(
            post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(register)))
        .andExpect(status().isCreated());

    LoginRequest badLogin =
        LoginRequest.builder().email("bob@example.com").password("nope").build();
    mockMvc
        .perform(
            post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(badLogin)))
        .andExpect(status().isUnauthorized());
  }
}
