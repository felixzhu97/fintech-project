package com.finpulse.server.customer.controller;

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
class CustomerAccountControllerTest {

  @Autowired private MockMvc mockMvc;

  @Test
  void shouldCreateCustomerAndAccount() throws Exception {
    MvcResult created =
        mockMvc
            .perform(
                post("/api/v1/customers")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        "{\"name\":\"Ada\",\"email\":\"ada@example.com\",\"kyc_status\":\"pending\"}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.customer_id").isNotEmpty())
            .andExpect(jsonPath("$.name").value("Ada"))
            .andReturn();

    String customerId =
        com.jayway.jsonpath.JsonPath.read(
            created.getResponse().getContentAsString(), "$.customer_id");

    mockMvc
        .perform(
            post("/api/v1/accounts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    "{\"customer_id\":\""
                        + customerId
                        + "\",\"account_type\":\"brokerage\",\"currency\":\"USD\"}"))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.account_id").isNotEmpty())
        .andExpect(jsonPath("$.status").value("active"));

    mockMvc
        .perform(get("/api/v1/customers/" + customerId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email").value("ada@example.com"));
  }
}
