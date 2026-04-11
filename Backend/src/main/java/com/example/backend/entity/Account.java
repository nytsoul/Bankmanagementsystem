package com.example.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Document(collection = "accounts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Account {
    @Id
    private String id;

    @Indexed(unique = true)
    private String accountNumber;

    private String userId;

    private AccountType accountType;

    private BigDecimal balance;

    private BigDecimal interestRate = BigDecimal.ZERO;

    private LocalDateTime createdAt;

    private LocalDateTime lastModified;

    private Boolean isActive = true;

    private Set<String> transactionIds = new HashSet<>();
    private Set<String> scheduledTransactionIds = new HashSet<>();

    public enum AccountType {
        SAVINGS, CHECKING, MONEY_MARKET, CD
    }
}
