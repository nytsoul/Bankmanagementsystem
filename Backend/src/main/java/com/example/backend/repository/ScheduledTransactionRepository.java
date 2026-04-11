package com.example.backend.repository;

import com.example.backend.entity.Account;
import com.example.backend.entity.ScheduledTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScheduledTransactionRepository extends JpaRepository<ScheduledTransaction, Long> {
    List<ScheduledTransaction> findByAccount(Account account);
    List<ScheduledTransaction> findByAccountAndStatusIn(Account account, List<String> statuses);
    List<ScheduledTransaction> findByNextExecutionDateBefore(LocalDateTime dateTime);
}
