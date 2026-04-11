package com.example.backend.service.impl;

import com.example.backend.dto.TransactionDTO;
import com.example.backend.entity.Transaction;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.TransactionRepository;
import com.example.backend.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionServiceImpl implements TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Override
    public TransactionDTO createTransaction(TransactionDTO transactionDTO) {
        Transaction transaction = Transaction.builder()
                .accountId(transactionDTO.getAccountId())
                .transactionType(Transaction.TransactionType.valueOf(transactionDTO.getTransactionType()))
                .amount(transactionDTO.getAmount())
                .transactionDate(LocalDateTime.now())
                .description(transactionDTO.getDescription())
                .recipientAccount(transactionDTO.getRecipientAccount())
                .recipientName(transactionDTO.getRecipientName())
                .status(Transaction.TransactionStatus.valueOf(transactionDTO.getStatus() != null ? transactionDTO.getStatus() : "PENDING"))
                .referenceNumber(generateReferenceNumber())
                .isFraudulent(false)
                .build();

        Transaction saved = transactionRepository.save(transaction);
        return convertToDTO(saved);
    }

    @Override
    public TransactionDTO getTransactionById(Long id) {
        throw new ResourceNotFoundException("String ID expected, not Long");
    }

    @Override
    public List<TransactionDTO> getTransactionsByAccountId(Long accountId) {
        throw new ResourceNotFoundException("String accountId expected, not Long");
    }

    @Override
    public List<TransactionDTO> getTransactionsByDateRange(Long accountId, LocalDateTime startDate, LocalDateTime endDate) {
        throw new ResourceNotFoundException("String accountId expected, not Long");
    }

    @Override
    public List<TransactionDTO> getFraudulentTransactions() {
        return transactionRepository.findByIsFraudulentTrue()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void detectFraud() {
        // TODO: Implement fraud detection algorithm
        // For now, just an empty implementation
    }

    private String generateReferenceNumber() {
        return "TXN-" + System.currentTimeMillis();
    }

    private TransactionDTO convertToDTO(Transaction transaction) {
        return TransactionDTO.builder()
                .id(transaction.getId())
                .accountId(transaction.getAccountId())
                .transactionType(transaction.getTransactionType().name())
                .amount(transaction.getAmount())
                .transactionDate(transaction.getTransactionDate())
                .description(transaction.getDescription())
                .recipientAccount(transaction.getRecipientAccount())
                .recipientName(transaction.getRecipientName())
                .status(transaction.getStatus().name())
                .referenceNumber(transaction.getReferenceNumber())
                .isFraudulent(transaction.getIsFraudulent())
                .fraudReason(transaction.getFraudReason())
                .build();
    }
}
