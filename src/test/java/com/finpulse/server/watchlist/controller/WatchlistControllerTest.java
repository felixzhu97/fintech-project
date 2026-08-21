package com.finpulse.server.watchlist.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.finpulse.server.customer.dto.CustomerRequest;
import com.finpulse.server.watchlist.dto.WatchlistRequest;
import com.finpulse.server.watchlistitem.dto.WatchlistItemRequest;
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
  @Autowired private ObjectMapper objectMapper;

  @Test
  void shouldCreateWatchlistAndItem() throws Exception {
    CustomerRequest customer =
        CustomerRequest.builder()
            .name("Grace")
            .email("grace@example.com")
            .kycStatus("pending")
            .build();
    MvcResult customerResult =
        mockMvc
            .perform(
                post("/api/v1/customers")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(customer)))
            .andExpect(status().isCreated())
            .andReturn();

    UUID customerId =
        UUID.fromString(
            com.jayway.jsonpath.JsonPath.read(
                customerResult.getResponse().getContentAsString(), "$.customer_id"));

    WatchlistRequest watchlist =
        WatchlistRequest.builder().customerId(customerId).name("Tech stocks").build();
    MvcResult watchlistResult =
        mockMvc
            .perform(
                post("/api/v1/watchlists")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(watchlist)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.watchlist_id").isNotEmpty())
            .andExpect(jsonPath("$.name").value("Tech stocks"))
            .andReturn();

    UUID watchlistId =
        UUID.fromString(
            com.jayway.jsonpath.JsonPath.read(
                watchlistResult.getResponse().getContentAsString(), "$.watchlist_id"));

    UUID instrumentId = UUID.randomUUID();
    WatchlistItemRequest item =
        WatchlistItemRequest.builder()
            .watchlistId(watchlistId)
            .instrumentId(instrumentId)
            .build();
    mockMvc
        .perform(
            post("/api/v1/watchlist-items")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(item)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.watchlist_item_id").isNotEmpty())
        .andExpect(jsonPath("$.instrument_id").value(instrumentId.toString()));

    mockMvc
        .perform(get("/api/v1/watchlists/" + watchlistId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.customer_id").value(customerId.toString()));
  }
}
