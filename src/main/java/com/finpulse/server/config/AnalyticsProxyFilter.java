package com.finpulse.server.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Enumeration;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Reverse-proxies Python analytics routes that remain on FastAPI after Go removal.
 *
 * <p>See Spring Framework HTTP interface / servlet filter patterns for outbound relay.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 20)
public class AnalyticsProxyFilter extends OncePerRequestFilter {
  private static final Set<String> HOP_BY_HOP =
      Set.of(
          "connection",
          "keep-alive",
          "proxy-authenticate",
          "proxy-authorization",
          "te",
          "trailers",
          "transfer-encoding",
          "upgrade",
          "host",
          "content-length");

  private static final List<String> ANALYTICS_PREFIXES =
      List.of(
          "/api/v1/portfolio",
          "/api/v1/risk-metrics",
          "/api/v1/analytics",
          "/api/v1/forecast",
          "/api/v1/valuations");

  private final String pythonBackendUrl;
  private final HttpClient httpClient =
      HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();

  public AnalyticsProxyFilter(
      @Value("${app.python-backend-url:http://127.0.0.1:8800}") String pythonBackendUrl) {
    this.pythonBackendUrl =
        pythonBackendUrl.endsWith("/")
            ? pythonBackendUrl.substring(0, pythonBackendUrl.length() - 1)
            : pythonBackendUrl;
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    String path = request.getRequestURI();
    for (String prefix : ANALYTICS_PREFIXES) {
      if (path.equals(prefix) || path.startsWith(prefix + "/")) {
        return false;
      }
    }
    return true;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    String query = request.getQueryString();
    String target =
        pythonBackendUrl
            + request.getRequestURI()
            + (query == null || query.isBlank() ? "" : "?" + query);
    try {
      HttpRequest.Builder builder =
          HttpRequest.newBuilder(URI.create(target)).timeout(Duration.ofSeconds(60));
      Enumeration<String> names = request.getHeaderNames();
      while (names.hasMoreElements()) {
        String name = names.nextElement();
        if (HOP_BY_HOP.contains(name.toLowerCase(Locale.ROOT))) {
          continue;
        }
        Enumeration<String> values = request.getHeaders(name);
        while (values.hasMoreElements()) {
          builder.header(name, values.nextElement());
        }
      }
      byte[] body = request.getInputStream().readAllBytes();
      String method = request.getMethod();
      if (body.length > 0 || "POST".equals(method) || "PUT".equals(method) || "PATCH".equals(method)) {
        builder.method(method, HttpRequest.BodyPublishers.ofByteArray(body));
      } else {
        builder.method(method, HttpRequest.BodyPublishers.noBody());
      }
      HttpResponse<byte[]> upstream =
          httpClient.send(builder.build(), HttpResponse.BodyHandlers.ofByteArray());
      response.setStatus(upstream.statusCode());
      upstream
          .headers()
          .map()
          .forEach(
              (name, values) -> {
                if (HOP_BY_HOP.contains(name.toLowerCase(Locale.ROOT))) {
                  return;
                }
                for (String value : values) {
                  response.addHeader(name, value);
                }
              });
      response.getOutputStream().write(upstream.body());
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      response.sendError(HttpServletResponse.SC_BAD_GATEWAY, "Analytics proxy interrupted");
    } catch (Exception e) {
      response.sendError(HttpServletResponse.SC_BAD_GATEWAY, "Analytics proxy failed");
    }
  }
}
