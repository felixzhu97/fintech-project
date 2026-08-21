package com.finpulse.server.auth.infra.persistence;

import com.finpulse.server.auth.domain.model.Session;
import com.finpulse.server.auth.domain.model.UserCredential;
import com.finpulse.server.auth.domain.repository.AuthRepository;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@RequiredArgsConstructor
public class AuthRepositoryImpl implements AuthRepository {
  private final SpringDataUserCredentialRepository credentials;
  private final SpringDataSessionRepository sessions;

  @Override
  public Optional<UserCredential> findCredentialByEmail(String email) {
    return credentials.findByEmail(email).map(this::toCredential);
  }

  @Override
  public Optional<UserCredential> findCredentialByCustomerId(UUID customerId) {
    return credentials.findByCustomerId(customerId).map(this::toCredential);
  }

  @Override
  public UserCredential saveCredential(UserCredential credential) {
    return toCredential(credentials.save(toCredentialEntity(credential)));
  }

  @Override
  public Session saveSession(Session session) {
    return toSession(sessions.save(toSessionEntity(session)));
  }

  @Override
  public Optional<Session> findSessionByToken(String token) {
    return sessions.findByToken(token).map(this::toSession);
  }

  @Override
  @Transactional
  public void deleteSessionByToken(String token) {
    sessions.deleteByToken(token);
  }

  private UserCredential toCredential(UserCredentialEntity e) {
    return UserCredential.rehydrate(
        e.getCredentialId(),
        e.getCustomerId(),
        e.getEmail(),
        e.getPasswordHash(),
        e.getCreatedAt());
  }

  private UserCredentialEntity toCredentialEntity(UserCredential c) {
    return UserCredentialEntity.builder()
        .credentialId(c.credentialId())
        .customerId(c.customerId())
        .email(c.email())
        .passwordHash(c.passwordHash())
        .createdAt(c.createdAt())
        .build();
  }

  private Session toSession(SessionEntity e) {
    return Session.rehydrate(
        e.getSessionId(), e.getCustomerId(), e.getToken(), e.getExpiresAt(), e.getCreatedAt());
  }

  private SessionEntity toSessionEntity(Session s) {
    return SessionEntity.builder()
        .sessionId(s.sessionId())
        .customerId(s.customerId())
        .token(s.token())
        .expiresAt(s.expiresAt())
        .createdAt(s.createdAt())
        .build();
  }
}
