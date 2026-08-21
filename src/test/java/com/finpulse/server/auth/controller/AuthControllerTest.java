package com.finpulse.server.auth.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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

  @Test
  void shouldRegisterLoginAndReturnMeWhenCredentialsValid() throws Exception {
    String register =
        """
        {"name":"Ada","email":"ada@example.com","password":"secret123"}
        """;
    MvcResult created =
        mockMvc
            .perform(
                post("/api/v1/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(register))
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

    mockMvc
        .perform(
            post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"ada@example.com\",\"password\":\"secret123\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.token").isNotEmpty());
  }

  @Test
  void shouldRejectLoginWhenPasswordWrong() throws Exception {
    mockMvc
        .perform(
            post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    "{\"name\":\"Bob\",\"email\":\"bob@example.com\",\"password\":\"secret123\"}"))
        .andExpect(status().isCreated());

    mockMvc
        .perform(
            post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"bob@example.com\",\"password\":\"nope\"}"))
        .andExpect(status().isUnauthorized());
  }
}
