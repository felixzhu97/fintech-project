package com.finpulse.server.watchlist.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
class WatchlistControllerTest {

  @Autowired private MockMvc mockMvc;

  @Test
  void shouldCreateWatchlistAndItem() throws Exception {
    MvcResult customer =
        mockMvc
            .perform(
                post("/api/v1/customers")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        "{\"name\":\"Grace\",\"email\":\"grace@example.com\",\"kyc_status\":\"pending\"}"))
            .andExpect(status().isCreated())
            .andReturn();

    String customerId =
        com.jayway.jsonpath.JsonPath.read(
            customer.getResponse().getContentAsString(), "$.customer_id");

    MvcResult watchlist =
        mockMvc
            .perform(
                post("/api/v1/watchlists")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        "{\"customer_id\":\""
                            + customerId
                            + "\",\"name\":\"Tech stocks\"}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.watchlist_id").isNotEmpty())
            .andExpect(jsonPath("$.name").value("Tech stocks"))
            .andReturn();

    String watchlistId =
        com.jayway.jsonpath.JsonPath.read(
            watchlist.getResponse().getContentAsString(), "$.watchlist_id");

    String instrumentId = UUID.randomUUID().toString();

    mockMvc
        .perform(
            post("/api/v1/watchlist-items")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    "{\"watchlist_id\":\""
                        + watchlistId
                        + "\",\"instrument_id\":\""
                        + instrumentId
                        + "\"}"))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.watchlist_item_id").isNotEmpty())
        .andExpect(jsonPath("$.instrument_id").value(instrumentId));

    mockMvc
        .perform(get("/api/v1/watchlists/" + watchlistId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.customer_id").value(customerId));
  }
}
