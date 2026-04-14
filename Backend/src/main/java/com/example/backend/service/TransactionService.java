package com.example.backend.service;

import com.example.backend.dto.TransactionDTO;
import java.time.LocalDateTime;
import java.util.List;

public interface TransactionService {
    TransactionDTO createTransaction(TransactionDTO transactionDTO);
    TransactionDTO getTransactionById(String id);
    List<TransactionDTO> getAllTransactions();
    List<TransactionDTO> getTransactionsByAccountId(String accountId);
    List<TransactionDTO> getTransactionsByDateRange(String accountId, LocalDateTime startDate, LocalDateTime endDate);
    List<TransactionDTO> getFraudulentTransactions();
    void detectFraud();
}
