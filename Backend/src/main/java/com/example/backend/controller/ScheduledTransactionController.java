package com.example.backend.controller;

import com.example.backend.dto.ScheduledTransactionDTO;
import com.example.backend.service.ScheduledTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/scheduled-transactions")
@CrossOrigin(origins = "http://localhost:5173")
public class ScheduledTransactionController {

    @Autowired
    private ScheduledTransactionService scheduledTransactionService;

    @PostMapping
    public ResponseEntity<ScheduledTransactionDTO> createScheduledTransaction(@RequestBody ScheduledTransactionDTO dto) {
        return ResponseEntity.ok(scheduledTransactionService.createScheduledTransaction(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScheduledTransactionDTO> getScheduledTransaction(@PathVariable String id) {
        throw new RuntimeException("Implement getScheduledTransactionById with String ID");
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<ScheduledTransactionDTO>> getAccountScheduledTransactions(@PathVariable String accountId) {
        throw new RuntimeException("Implement getScheduledTransactionsByAccountId with String accountId");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ScheduledTransactionDTO> updateScheduledTransaction(@PathVariable String id, @RequestBody ScheduledTransactionDTO dto) {
        throw new RuntimeException("Implement updateScheduledTransaction with String ID");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScheduledTransaction(@PathVariable String id) {
        throw new RuntimeException("Implement deleteScheduledTransaction with String ID");
    }

    @PostMapping("/process")
    public ResponseEntity<Void> processScheduledTransactions() {
        scheduledTransactionService.processScheduledTransactions();
        return ResponseEntity.ok().build();
    }
}
