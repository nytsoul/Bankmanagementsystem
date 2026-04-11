package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduledTransactionDTO {
    private String id;
    private String accountId;
    private String description;
    private BigDecimal amount;
    private LocalDateTime scheduledDate;
    private LocalDateTime nextExecutionDate;
    private String recurrenceType;
    private Integer recurrenceInterval;
    private String status;
    private String recipientAccount;
    private String recipientName;
}
