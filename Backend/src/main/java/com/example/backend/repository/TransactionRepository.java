package com.example.backend.repository;

import com.example.backend.entity.Account;
import com.example.backend.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByAccount(Account account);
    List<Transaction> findByAccountOrderByTransactionDateDesc(Account account);
    List<Transaction> findByAccountAndTransactionDateBetween(Account account, LocalDateTime startDate, LocalDateTime endDate);
    List<Transaction> findByIsFraudulentTrue();
}
