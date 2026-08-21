package com.finpulse.server.blockchain.controller;

import com.finpulse.server.blockchain.service.BlockchainService;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/blockchain")
@RequiredArgsConstructor
public class BlockchainController {
  private final BlockchainService service;

  @PostMapping("/seed-balance")
  @ResponseStatus(HttpStatus.CREATED)
  public Map<String, Object> seed(@RequestBody Map<String, Object> body) {
    UUID accountId = UUID.fromString(String.valueOf(body.get("account_id")));
    String currency = body.get("currency") == null ? null : String.valueOf(body.get("currency"));
    BigDecimal amount = new BigDecimal(String.valueOf(body.get("amount")));
    return service.seedBalance(accountId, currency, amount);
  }

  @GetMapping("/blocks")
  public List<Map<String, Object>> blocks(
      @RequestParam(defaultValue = "100") int limit,
      @RequestParam(defaultValue = "0") int offset) {
    return service.listBlocks(limit, offset);
  }

  @GetMapping("/blocks/{block_index}")
  public Map<String, Object> block(@PathVariable("block_index") int blockIndex) {
    return service.getBlock(blockIndex);
  }

  @PostMapping("/transfers")
  public Map<String, Object> transfer(@RequestBody Map<String, Object> body) {
    return service.transfer(
        UUID.fromString(String.valueOf(body.get("sender_account_id"))),
        UUID.fromString(String.valueOf(body.get("receiver_account_id"))),
        new BigDecimal(String.valueOf(body.get("amount"))),
        body.get("currency") == null ? null : String.valueOf(body.get("currency")));
  }

  @GetMapping("/transactions/{tx_id}")
  public Map<String, Object> transaction(@PathVariable("tx_id") UUID txId) {
    return service.getTransaction(txId);
  }

  @GetMapping("/balances")
  public Map<String, Object> balance(
      @RequestParam("account_id") UUID accountId,
      @RequestParam(value = "currency", required = false) String currency) {
    return service.getBalance(accountId, currency);
  }
}
