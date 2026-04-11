package com.example.backend.service.impl;

import com.example.backend.dto.ScheduledTransactionDTO;
import com.example.backend.entity.ScheduledTransaction;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.ScheduledTransactionRepository;
import com.example.backend.service.ScheduledTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScheduledTransactionServiceImpl implements ScheduledTransactionService {

    @Autowired
    private ScheduledTransactionRepository scheduledTransactionRepository;

    @Override
    public ScheduledTransactionDTO createScheduledTransaction(ScheduledTransactionDTO dto) {
        ScheduledTransaction scheduledTransaction = ScheduledTransaction.builder()
                .accountId(dto.getAccountId())
                .description(dto.getDescription())
                .amount(dto.getAmount())
                .scheduledDate(dto.getScheduledDate())
                .nextExecutionDate(dto.getScheduledDate())
                .recurrenceType(ScheduledTransaction.RecurrenceType.valueOf(dto.getRecurrenceType() != null ? dto.getRecurrenceType() : "ONCE"))
                .recurrenceInterval(dto.getRecurrenceInterval())
                .status(ScheduledTransaction.ScheduleStatus.valueOf(dto.getStatus() != null ? dto.getStatus() : "ACTIVE"))
                .recipientAccount(dto.getRecipientAccount())
                .recipientName(dto.getRecipientName())
                .createdAt(LocalDateTime.now())
                .build();

        ScheduledTransaction saved = scheduledTransactionRepository.save(scheduledTransaction);
        return convertToDTO(saved);
    }

    @Override
    public ScheduledTransactionDTO getScheduledTransactionById(Long id) {
        throw new ResourceNotFoundException("String ID expected, not Long");
    }

    @Override
    public List<ScheduledTransactionDTO> getScheduledTransactionsByAccountId(Long accountId) {
        throw new ResourceNotFoundException("String accountId expected, not Long");
    }

    @Override
    public ScheduledTransactionDTO updateScheduledTransaction(Long id, ScheduledTransactionDTO dto) {
        throw new ResourceNotFoundException("String ID expected, not Long");
    }

    @Override
    public void deleteScheduledTransaction(Long id) {
        throw new ResourceNotFoundException("String ID expected, not Long");
    }

    @Override
    public void processScheduledTransactions() {
        // TODO: Implement scheduled transaction processing
        // Find all transactions with nextExecutionDate <= now()
        // Process them and update nextExecutionDate based on recurrence
    }

    private ScheduledTransactionDTO convertToDTO(ScheduledTransaction scheduledTransaction) {
        return ScheduledTransactionDTO.builder()
                .id(scheduledTransaction.getId())
                .accountId(scheduledTransaction.getAccountId())
                .description(scheduledTransaction.getDescription())
                .amount(scheduledTransaction.getAmount())
                .scheduledDate(scheduledTransaction.getScheduledDate())
                .nextExecutionDate(scheduledTransaction.getNextExecutionDate())
                .recurrenceType(scheduledTransaction.getRecurrenceType().name())
                .recurrenceInterval(scheduledTransaction.getRecurrenceInterval())
                .status(scheduledTransaction.getStatus().name())
                .recipientAccount(scheduledTransaction.getRecipientAccount())
                .recipientName(scheduledTransaction.getRecipientName())
                .build();
    }
}
