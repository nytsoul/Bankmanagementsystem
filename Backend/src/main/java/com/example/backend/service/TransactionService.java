package com.example.backend.service;

import com.example.backend.dto.TransactionDTO;
import java.time.LocalDateTime;
import java.util.List;

public interface TransactionService {
    TransactionDTO createTransaction(TransactionDTO transactionDTO);
    TransactionDTO getTransactionById(Long id);
    List<TransactionDTO> getTransactionsByAccountId(Long accountId);
    List<TransactionDTO> getTransactionsByDateRange(Long accountId, LocalDateTime startDate, LocalDateTime endDate);
    List<TransactionDTO> getFraudulentTransactions();
    void detectFraud();
}
