package com.example.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "scheduled_transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduledTransaction {
    @Id
    private String id;

    private String accountId;

    private String description;

    private BigDecimal amount;

    private LocalDateTime scheduledDate;

    private LocalDateTime nextExecutionDate;

    private RecurrenceType recurrenceType;

    private Integer recurrenceInterval;

    private ScheduleStatus status;

    private String recipientAccount;
    private String recipientName;

    private LocalDateTime createdAt;

    private LocalDateTime lastModified;

    public enum RecurrenceType {
        ONCE, DAILY, WEEKLY, BIWEEKLY, MONTHLY, QUARTERLY, YEARLY
    }

    public enum ScheduleStatus {
        ACTIVE, PAUSED, COMPLETED, CANCELLED
    }
}
