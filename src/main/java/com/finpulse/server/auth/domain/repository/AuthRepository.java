package com.finpulse.server.auth.domain.repository;

import com.finpulse.server.auth.domain.model.Session;
import com.finpulse.server.auth.domain.model.UserCredential;
import java.util.Optional;
import java.util.UUID;

public interface AuthRepository {
  Optional<UserCredential> findCredentialByEmail(String email);

  Optional<UserCredential> findCredentialByCustomerId(UUID customerId);

  UserCredential saveCredential(UserCredential credential);

  Session saveSession(Session session);

  Optional<Session> findSessionByToken(String token);

  void deleteSessionByToken(String token);
}
