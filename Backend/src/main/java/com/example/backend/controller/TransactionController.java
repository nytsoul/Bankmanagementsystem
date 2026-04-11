package com.example.backend.controller;

import com.example.backend.dto.TransactionDTO;
import com.example.backend.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping
    public ResponseEntity<TransactionDTO> createTransaction(@RequestBody TransactionDTO transactionDTO) {
        return ResponseEntity.ok(transactionService.createTransaction(transactionDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionDTO> getTransaction(@PathVariable String id) {
        throw new RuntimeException("Implement getTransactionById with String ID");
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<TransactionDTO>> getAccountTransactions(@PathVariable String accountId) {
        throw new RuntimeException("Implement getTransactionsByAccountId with String accountId");
    }

    @GetMapping("/account/{accountId}/range")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByDateRange(
            @PathVariable String accountId,
            @RequestParam java.time.LocalDateTime startDate,
            @RequestParam java.time.LocalDateTime endDate) {
        throw new RuntimeException("Implement getTransactionsByDateRange with String accountId");
    }

    @GetMapping("/fraud-checks")
    public ResponseEntity<List<TransactionDTO>> getFraudulentTransactions() {
        return ResponseEntity.ok(transactionService.getFraudulentTransactions());
    }

    @PostMapping("/detect-fraud")
    public ResponseEntity<Void> detectFraud() {
        transactionService.detectFraud();
        return ResponseEntity.ok().build();
    }
}
