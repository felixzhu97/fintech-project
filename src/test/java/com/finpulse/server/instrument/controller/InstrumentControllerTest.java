package com.finpulse.server.instrument.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.finpulse.server.instrument.dto.InstrumentRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
class InstrumentControllerTest {

  @Autowired private MockMvc mockMvc;
  @Autowired private ObjectMapper objectMapper;

  @Test
  void shouldCreateInstrumentAndList() throws Exception {
    InstrumentRequest request =
        InstrumentRequest.builder()
            .symbol("AAPL")
            .name("Apple Inc.")
            .assetClass("equity")
            .currency("USD")
            .exchange("NASDAQ")
            .build();
    mockMvc
        .perform(
            post("/api/v1/instruments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.instrument_id").isNotEmpty())
        .andExpect(jsonPath("$.symbol").value("AAPL"))
        .andExpect(jsonPath("$.name").value("Apple Inc."));

    MvcResult list =
        mockMvc
            .perform(get("/api/v1/instruments"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].symbol").value("AAPL"))
            .andReturn();

    String instrumentId =
        com.jayway.jsonpath.JsonPath.read(
            list.getResponse().getContentAsString(), "$[0].instrument_id");

    mockMvc
        .perform(get("/api/v1/instruments/" + instrumentId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.exchange").value("NASDAQ"));
  }
}
