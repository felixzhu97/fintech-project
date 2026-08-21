package com.finpulse.server.quote.service;

import com.finpulse.server.quote.dto.QuoteResponse;
import com.finpulse.server.quote.infra.persistence.RealtimeQuoteEntity;
import com.finpulse.server.quote.infra.persistence.SpringDataRealtimeQuoteRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class QuoteService {
  private final SpringDataRealtimeQuoteRepository repository;

  public Map<String, QuoteResponse> getQuotes(String symbolsParam) {
    List<String> symbols = parseSymbols(symbolsParam);
    if (symbols.isEmpty()) {
      return Map.of();
    }
    Map<String, QuoteResponse> out = new HashMap<>();
    long now = System.currentTimeMillis() / 1000;
    for (RealtimeQuoteEntity e : repository.findBySymbolIn(symbols)) {
      out.put(
          e.getSymbol(),
          QuoteResponse.builder()
              .price(e.getPrice())
              .change(e.getChange())
              .changeRate(e.getChangeRate())
              .timestamp(now)
              .build());
    }
    return out;
  }

  public Map<String, List<BigDecimal>> getHistory(String symbolsParam, int minutes) {
    List<String> symbols = parseSymbols(symbolsParam);
    Map<String, BigDecimal> prices = new HashMap<>();
    for (RealtimeQuoteEntity e : repository.findBySymbolIn(symbols)) {
      prices.put(e.getSymbol(), e.getPrice());
    }
    int n = Math.max(1, Math.min(minutes, 60));
    Map<String, List<BigDecimal>> out = new HashMap<>();
    ThreadLocalRandom rnd = ThreadLocalRandom.current();
    for (String sym : symbols) {
      BigDecimal base = prices.getOrDefault(sym, BigDecimal.valueOf(100));
      BigDecimal p = base;
      BigDecimal[] hist = new BigDecimal[n];
      for (int i = 0; i < n; i++) {
        double delta = (rnd.nextDouble() - 0.5) * base.doubleValue() * 0.01;
        p = p.add(BigDecimal.valueOf(delta)).setScale(2, RoundingMode.HALF_UP);
        hist[i] = p;
      }
      out.put(sym, List.of(hist));
    }
    return out;
  }

  private static List<String> parseSymbols(String symbolsParam) {
    if (symbolsParam == null || symbolsParam.isBlank()) {
      return List.of();
    }
    return Arrays.stream(symbolsParam.split(","))
        .map(String::trim)
        .filter(s -> !s.isEmpty())
        .map(s -> s.toUpperCase(Locale.ROOT))
        .collect(Collectors.toList());
  }
}
