package com.finpulse.server.preference.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
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
class UserPreferenceControllerTest {

  @Autowired private MockMvc mockMvc;

  @Test
  void shouldReturnHealthOk() throws Exception {
    mockMvc
        .perform(get("/health"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status").value("ok"));
  }

  @Test
  void shouldCreateGetUpdateAndDeletePreference() throws Exception {
    String body =
        """
        {
          "customer_id": "11111111-1111-1111-1111-111111111111",
          "theme": "dark",
          "language": "en",
          "notifications_enabled": true
        }
        """;

    MvcResult created =
        mockMvc
            .perform(
                post("/api/v1/user-preferences")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(body))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.theme").value("dark"))
            .andExpect(jsonPath("$.customer_id").value("11111111-1111-1111-1111-111111111111"))
            .andReturn();

    String preferenceId =
        com.jayway.jsonpath.JsonPath.read(
            created.getResponse().getContentAsString(), "$.preference_id");

    mockMvc
        .perform(get("/api/v1/user-preferences/" + preferenceId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.preference_id").value(preferenceId));

    String updateBody =
        """
        {
          "customer_id": "11111111-1111-1111-1111-111111111111",
          "theme": "light",
          "language": "zh",
          "notifications_enabled": false
        }
        """;

    mockMvc
        .perform(
            put("/api/v1/user-preferences/" + preferenceId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(updateBody))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.theme").value("light"))
        .andExpect(jsonPath("$.language").value("zh"));

    mockMvc
        .perform(delete("/api/v1/user-preferences/" + preferenceId))
        .andExpect(status().isNoContent());

    mockMvc
        .perform(get("/api/v1/user-preferences/" + preferenceId))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.detail").value("User preference not found"));
  }

  @Test
  void shouldRejectCreateWithoutCustomerId() throws Exception {
    mockMvc
        .perform(
            post("/api/v1/user-preferences")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                    {"theme":"dark","notifications_enabled":true}
                    """))
        .andExpect(status().isBadRequest());
  }
}
