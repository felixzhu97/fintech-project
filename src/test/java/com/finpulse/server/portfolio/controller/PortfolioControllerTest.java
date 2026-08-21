package com.finpulse.server.portfolio.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class PortfolioControllerTest {
  @Autowired private MockMvc mockMvc;

  @Test
  void shouldCreatePortfolio() throws Exception {
    UUID accountId = UUID.randomUUID();
    mockMvc
        .perform(
            post("/api/v1/portfolios")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    "{\"account_id\":\""
                        + accountId
                        + "\",\"name\":\"Growth\",\"base_currency\":\"USD\"}"))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.portfolio_id").isNotEmpty())
        .andExpect(jsonPath("$.name").value("Growth"));
  }
}
