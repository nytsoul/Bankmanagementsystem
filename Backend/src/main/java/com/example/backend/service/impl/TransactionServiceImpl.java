package com.example.backend.service.impl;

import com.example.backend.dto.TransactionDTO;
import com.example.backend.entity.Account;
import com.example.backend.entity.Transaction;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.AccountRepository;
import com.example.backend.repository.TransactionRepository;
import com.example.backend.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionServiceImpl implements TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Override
    public TransactionDTO createTransaction(TransactionDTO transactionDTO) {
        Account account = accountRepository.findById(transactionDTO.getAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + transactionDTO.getAccountId()));

        BigDecimal amount = transactionDTO.getAmount() != null ? transactionDTO.getAmount() : BigDecimal.ZERO;
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResourceNotFoundException("Amount must be greater than zero");
        }

        Transaction.TransactionType transactionType = Transaction.TransactionType.valueOf(
            transactionDTO.getTransactionType().toUpperCase()
        );

        if (transactionType == Transaction.TransactionType.WITHDRAWAL
                || transactionType == Transaction.TransactionType.TRANSFER
                || transactionType == Transaction.TransactionType.PAYMENT) {
            if (account.getBalance().compareTo(amount) < 0) {
                throw new ResourceNotFoundException("Insufficient balance");
            }
        }

        if (transactionType == Transaction.TransactionType.DEPOSIT
                || transactionType == Transaction.TransactionType.INTEREST) {
            account.setBalance(account.getBalance().add(amount));
        } else if (transactionType == Transaction.TransactionType.WITHDRAWAL
                || transactionType == Transaction.TransactionType.PAYMENT) {
            account.setBalance(account.getBalance().subtract(amount));
        } else if (transactionType == Transaction.TransactionType.TRANSFER) {
            account.setBalance(account.getBalance().subtract(amount));

            if (transactionDTO.getRecipientAccount() != null && !transactionDTO.getRecipientAccount().isBlank()) {
                Account recipient = accountRepository.findByAccountNumber(transactionDTO.getRecipientAccount())
                        .orElseThrow(() -> new ResourceNotFoundException("Recipient account not found"));
                recipient.setBalance(recipient.getBalance().add(amount));
                recipient.setLastModified(LocalDateTime.now());
                accountRepository.save(recipient);
            }
        }

        account.setLastModified(LocalDateTime.now());
        accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .accountId(transactionDTO.getAccountId())
                .transactionType(transactionType)
                .amount(amount)
                .transactionDate(LocalDateTime.now())
                .description(transactionDTO.getDescription())
                .recipientAccount(transactionDTO.getRecipientAccount())
                .recipientName(transactionDTO.getRecipientName())
                .status(Transaction.TransactionStatus.valueOf(
                    transactionDTO.getStatus() != null ? transactionDTO.getStatus().toUpperCase() : "COMPLETED"
                ))
                .referenceNumber(generateReferenceNumber())
                .isFraudulent(false)
                .build();

        Transaction saved = transactionRepository.save(transaction);
        return convertToDTO(saved);
    }

    @Override
    public TransactionDTO getTransactionById(String id) {
        return transactionRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
    }

    @Override
    public List<TransactionDTO> getAllTransactions() {
        return transactionRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TransactionDTO> getTransactionsByAccountId(String accountId) {
        return transactionRepository.findByAccountIdOrderByTransactionDateDesc(accountId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TransactionDTO> getTransactionsByDateRange(String accountId, LocalDateTime startDate, LocalDateTime endDate) {
        return transactionRepository.findByAccountIdAndTransactionDateBetween(accountId, startDate, endDate)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
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
