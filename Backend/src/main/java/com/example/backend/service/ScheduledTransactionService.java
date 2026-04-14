package com.example.backend.service;

import com.example.backend.dto.ScheduledTransactionDTO;
import java.util.List;

public interface ScheduledTransactionService {
    ScheduledTransactionDTO createScheduledTransaction(ScheduledTransactionDTO dto);
    ScheduledTransactionDTO getScheduledTransactionById(String id);
    List<ScheduledTransactionDTO> getAllScheduledTransactions();
    List<ScheduledTransactionDTO> getScheduledTransactionsByAccountId(String accountId);
    ScheduledTransactionDTO updateScheduledTransaction(String id, ScheduledTransactionDTO dto);
    void deleteScheduledTransaction(String id);
    void processScheduledTransactions();
}
