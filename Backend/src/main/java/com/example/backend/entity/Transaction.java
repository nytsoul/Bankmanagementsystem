package com.example.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {
    @Id
    private String id;

    private String accountId;

    private TransactionType transactionType;

    private BigDecimal amount;

    private LocalDateTime transactionDate;

    private String description;

    private String recipientAccount;
    private String recipientName;

    private TransactionStatus status;

    private String referenceNumber;

    @lombok.Builder.Default
    private Boolean isFraudulent = false;

    private String fraudReason;

    public enum TransactionType {
        DEPOSIT, WITHDRAWAL, TRANSFER, PAYMENT, INTEREST
    }

    public enum TransactionStatus {
        PENDING, COMPLETED, FAILED, CANCELLED
    }
}
