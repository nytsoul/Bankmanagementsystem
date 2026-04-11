package com.example.backend.service;

import com.example.backend.dto.ScheduledTransactionDTO;
import java.util.List;

public interface ScheduledTransactionService {
    ScheduledTransactionDTO createScheduledTransaction(ScheduledTransactionDTO dto);
    ScheduledTransactionDTO getScheduledTransactionById(Long id);
    List<ScheduledTransactionDTO> getScheduledTransactionsByAccountId(Long accountId);
    ScheduledTransactionDTO updateScheduledTransaction(Long id, ScheduledTransactionDTO dto);
    void deleteScheduledTransaction(Long id);
    void processScheduledTransactions();
}
