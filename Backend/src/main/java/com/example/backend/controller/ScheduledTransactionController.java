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

    @GetMapping
    public ResponseEntity<List<ScheduledTransactionDTO>> getAllScheduledTransactions() {
        return ResponseEntity.ok(scheduledTransactionService.getAllScheduledTransactions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScheduledTransactionDTO> getScheduledTransaction(@PathVariable String id) {
        return ResponseEntity.ok(scheduledTransactionService.getScheduledTransactionById(id));
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<ScheduledTransactionDTO>> getAccountScheduledTransactions(@PathVariable String accountId) {
        return ResponseEntity.ok(scheduledTransactionService.getScheduledTransactionsByAccountId(accountId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ScheduledTransactionDTO> updateScheduledTransaction(@PathVariable String id, @RequestBody ScheduledTransactionDTO dto) {
        return ResponseEntity.ok(scheduledTransactionService.updateScheduledTransaction(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScheduledTransaction(@PathVariable String id) {
        scheduledTransactionService.deleteScheduledTransaction(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/process")
    public ResponseEntity<Void> processScheduledTransactions() {
        scheduledTransactionService.processScheduledTransactions();
        return ResponseEntity.ok().build();
    }
}
