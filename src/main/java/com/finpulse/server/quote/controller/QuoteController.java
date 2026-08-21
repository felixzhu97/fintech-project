package com.finpulse.server.quote.controller;

import com.finpulse.server.quote.dto.QuoteResponse;
import com.finpulse.server.quote.service.QuoteService;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/quotes")
@RequiredArgsConstructor
public class QuoteController {
  private final QuoteService quoteService;

  @GetMapping
  public Map<String, QuoteResponse> quotes(@RequestParam(required = false) String symbols) {
    return quoteService.getQuotes(symbols);
  }

  @GetMapping("/history")
  public Map<String, List<BigDecimal>> history(
      @RequestParam String symbols, @RequestParam(defaultValue = "5") int minutes) {
    if (symbols == null || symbols.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "symbols is required");
    }
    return quoteService.getHistory(symbols, minutes);
  }
}
