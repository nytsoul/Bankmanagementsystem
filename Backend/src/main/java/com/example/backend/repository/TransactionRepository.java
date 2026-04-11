package com.example.backend.repository;

import com.example.backend.entity.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findByAccountId(String accountId);
    List<Transaction> findByAccountIdOrderByTransactionDateDesc(String accountId);
    List<Transaction> findByAccountIdAndTransactionDateBetween(String accountId, LocalDateTime startDate, LocalDateTime endDate);
    List<Transaction> findByIsFraudulentTrue();
}
