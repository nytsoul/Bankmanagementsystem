package com.example.backend.repository;

import com.example.backend.entity.ScheduledTransaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScheduledTransactionRepository extends MongoRepository<ScheduledTransaction, String> {
    List<ScheduledTransaction> findByAccountId(String accountId);
    List<ScheduledTransaction> findByAccountIdAndStatusIn(String accountId, List<String> statuses);
    List<ScheduledTransaction> findByNextExecutionDateBefore(LocalDateTime dateTime);
}
