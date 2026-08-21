package com.finpulse.server.blockchain.service;

import com.finpulse.server.blockchain.infra.persistence.BlockEntity;
import com.finpulse.server.blockchain.infra.persistence.ChainTransactionEntity;
import com.finpulse.server.blockchain.infra.persistence.SpringDataBlockRepository;
import com.finpulse.server.blockchain.infra.persistence.SpringDataChainTransactionRepository;
import com.finpulse.server.blockchain.infra.persistence.SpringDataWalletBalanceRepository;
import com.finpulse.server.blockchain.infra.persistence.WalletBalanceEntity;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.HexFormat;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
@RequiredArgsConstructor
public class BlockchainService {
  private final SpringDataWalletBalanceRepository wallets;
  private final SpringDataBlockRepository blocks;
  private final SpringDataChainTransactionRepository transactions;

  public Map<String, Object> seedBalance(UUID accountId, String currency, BigDecimal amount) {
    if (amount == null || amount.signum() <= 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "amount must be positive");
    }
    String cur = (currency == null || currency.isBlank()) ? "SIM_COIN" : currency;
    WalletBalanceEntity wallet =
        wallets
            .findByAccountIdAndCurrency(accountId, cur)
            .orElse(
                WalletBalanceEntity.builder()
                    .accountId(accountId)
                    .currency(cur)
                    .balance(BigDecimal.ZERO)
                    .updatedAt(Instant.now())
                    .build());
    wallet.setBalance(wallet.getBalance().add(amount));
    wallet.setUpdatedAt(Instant.now());
    wallets.save(wallet);
    return Map.of(
        "account_id", accountId, "currency", cur, "balance", wallet.getBalance());
  }

  @Transactional(readOnly = true)
  public List<Map<String, Object>> listBlocks(int limit, int offset) {
    return blocks.findAllByOrderByBlockIndexAsc().stream()
        .skip(Math.max(offset, 0))
        .limit(limit <= 0 ? 100 : limit)
        .map(this::blockJson)
        .toList();
  }

  @Transactional(readOnly = true)
  public Map<String, Object> getBlock(int blockIndex) {
    BlockEntity block =
        blocks
            .findById(blockIndex)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Block not found"));
    Map<String, Object> json = blockJson(block);
    json.put(
        "transactions",
        transactions.findByBlockIndex(blockIndex).stream().map(this::txJson).toList());
    return json;
  }

  public Map<String, Object> transfer(
      UUID sender, UUID receiver, BigDecimal amount, String currency) {
    if (amount == null || amount.signum() <= 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "amount must be positive");
    }
    String cur = (currency == null || currency.isBlank()) ? "SIM_COIN" : currency;
    WalletBalanceEntity senderWallet =
        wallets
            .findByAccountIdAndCurrency(sender, cur)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "insufficient balance"));
    if (senderWallet.getBalance().compareTo(amount) < 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "insufficient balance");
    }
    WalletBalanceEntity receiverWallet =
        wallets
            .findByAccountIdAndCurrency(receiver, cur)
            .orElse(
                WalletBalanceEntity.builder()
                    .accountId(receiver)
                    .currency(cur)
                    .balance(BigDecimal.ZERO)
                    .updatedAt(Instant.now())
                    .build());
    senderWallet.setBalance(senderWallet.getBalance().subtract(amount));
    senderWallet.setUpdatedAt(Instant.now());
    receiverWallet.setBalance(receiverWallet.getBalance().add(amount));
    receiverWallet.setUpdatedAt(Instant.now());
    wallets.save(senderWallet);
    wallets.save(receiverWallet);

    int nextIndex =
        blocks.findTopByOrderByBlockIndexDesc().map(b -> b.getBlockIndex() + 1).orElse(0);
    String previousHash =
        blocks.findTopByOrderByBlockIndexDesc().map(BlockEntity::getHash).orElse("genesis");
    Instant now = Instant.now();
    UUID txId = UUID.randomUUID();
    String hash = sha256(nextIndex + previousHash + txId + amount + cur);
    blocks.save(
        BlockEntity.builder()
            .blockIndex(nextIndex)
            .timestamp(now)
            .previousHash(previousHash)
            .hash(hash)
            .build());
    ChainTransactionEntity tx =
        ChainTransactionEntity.builder()
            .txId(txId)
            .blockIndex(nextIndex)
            .senderAccountId(sender)
            .receiverAccountId(receiver)
            .amount(amount)
            .currency(cur)
            .createdAt(now)
            .build();
    transactions.save(tx);
    return txJson(tx);
  }

  @Transactional(readOnly = true)
  public Map<String, Object> getTransaction(UUID txId) {
    return transactions
        .findById(txId)
        .map(this::txJson)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transaction not found"));
  }

  @Transactional(readOnly = true)
  public Map<String, Object> getBalance(UUID accountId, String currency) {
    String cur = (currency == null || currency.isBlank()) ? "SIM_COIN" : currency;
    BigDecimal balance =
        wallets
            .findByAccountIdAndCurrency(accountId, cur)
            .map(WalletBalanceEntity::getBalance)
            .orElse(BigDecimal.ZERO);
    return Map.of("account_id", accountId, "currency", cur, "balance", balance);
  }

  private Map<String, Object> blockJson(BlockEntity b) {
    Map<String, Object> m = new LinkedHashMap<>();
    m.put("index", b.getBlockIndex());
    m.put("timestamp", b.getTimestamp());
    m.put("previous_hash", b.getPreviousHash());
    m.put("hash", b.getHash());
    return m;
  }

  private Map<String, Object> txJson(ChainTransactionEntity t) {
    Map<String, Object> m = new LinkedHashMap<>();
    m.put("tx_id", t.getTxId());
    m.put("block_index", t.getBlockIndex());
    m.put("sender_account_id", t.getSenderAccountId());
    m.put("receiver_account_id", t.getReceiverAccountId());
    m.put("amount", t.getAmount());
    m.put("currency", t.getCurrency());
    m.put("created_at", t.getCreatedAt());
    return m;
  }

  private static String sha256(String input) {
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      return HexFormat.of().formatHex(digest.digest(input.getBytes(StandardCharsets.UTF_8)));
    } catch (Exception e) {
      throw new IllegalStateException(e);
    }
  }
}
