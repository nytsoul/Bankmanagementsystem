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
                .recurrenceType(ScheduledTransaction.RecurrenceType.valueOf(
                    dto.getRecurrenceType() != null ? dto.getRecurrenceType().toUpperCase() : "ONCE"
                ))
                .recurrenceInterval(dto.getRecurrenceInterval())
                .status(ScheduledTransaction.ScheduleStatus.valueOf(
                    dto.getStatus() != null ? dto.getStatus().toUpperCase() : "ACTIVE"
                ))
                .recipientAccount(dto.getRecipientAccount())
                .recipientName(dto.getRecipientName())
                .createdAt(LocalDateTime.now())
                .build();

        ScheduledTransaction saved = scheduledTransactionRepository.save(scheduledTransaction);
        return convertToDTO(saved);
    }

    @Override
    public ScheduledTransactionDTO getScheduledTransactionById(String id) {
        return scheduledTransactionRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Scheduled transaction not found with id: " + id));
    }

    @Override
    public List<ScheduledTransactionDTO> getAllScheduledTransactions() {
        return scheduledTransactionRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ScheduledTransactionDTO> getScheduledTransactionsByAccountId(String accountId) {
        return scheduledTransactionRepository.findByAccountId(accountId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ScheduledTransactionDTO updateScheduledTransaction(String id, ScheduledTransactionDTO dto) {
        ScheduledTransaction scheduledTransaction = scheduledTransactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheduled transaction not found with id: " + id));

        if (dto.getAccountId() != null) {
            scheduledTransaction.setAccountId(dto.getAccountId());
        }

        if (dto.getDescription() != null) {
            scheduledTransaction.setDescription(dto.getDescription());
        }

        if (dto.getAmount() != null) {
            scheduledTransaction.setAmount(dto.getAmount());
        }

        if (dto.getScheduledDate() != null) {
            scheduledTransaction.setScheduledDate(dto.getScheduledDate());
        }

        if (dto.getNextExecutionDate() != null) {
            scheduledTransaction.setNextExecutionDate(dto.getNextExecutionDate());
        }

        if (dto.getRecurrenceType() != null) {
            scheduledTransaction.setRecurrenceType(ScheduledTransaction.RecurrenceType.valueOf(dto.getRecurrenceType().toUpperCase()));
        }

        if (dto.getRecurrenceInterval() != null) {
            scheduledTransaction.setRecurrenceInterval(dto.getRecurrenceInterval());
        }

        if (dto.getStatus() != null) {
            scheduledTransaction.setStatus(ScheduledTransaction.ScheduleStatus.valueOf(dto.getStatus().toUpperCase()));
        }

        if (dto.getRecipientAccount() != null) {
            scheduledTransaction.setRecipientAccount(dto.getRecipientAccount());
        }

        if (dto.getRecipientName() != null) {
            scheduledTransaction.setRecipientName(dto.getRecipientName());
        }

        scheduledTransaction.setLastModified(LocalDateTime.now());
        ScheduledTransaction saved = scheduledTransactionRepository.save(scheduledTransaction);
        return convertToDTO(saved);
    }

    @Override
    public void deleteScheduledTransaction(String id) {
        if (!scheduledTransactionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Scheduled transaction not found with id: " + id);
        }
        scheduledTransactionRepository.deleteById(id);
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
