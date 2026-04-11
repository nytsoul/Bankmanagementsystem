package com.example.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "scheduled_transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduledTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private LocalDateTime scheduledDate;

    private LocalDateTime nextExecutionDate;

    @Enumerated(EnumType.STRING)
    private RecurrenceType recurrenceType;

    private Integer recurrenceInterval;

    @Enumerated(EnumType.STRING)
    private ScheduleStatus status;

    private String recipientAccount;
    private String recipientName;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime lastModified;

    public enum RecurrenceType {
        ONCE, DAILY, WEEKLY, BIWEEKLY, MONTHLY, QUARTERLY, YEARLY
    }

    public enum ScheduleStatus {
        ACTIVE, PAUSED, COMPLETED, CANCELLED
    }
}
