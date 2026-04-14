package com.example.backend.service.impl;

import com.example.backend.dto.AccountDTO;
import com.example.backend.entity.Account;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.AccountRepository;
import com.example.backend.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountServiceImpl implements AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Override
    public AccountDTO createAccount(AccountDTO accountDTO, String userId) {
        Account account = Account.builder()
                .accountNumber(accountDTO.getAccountNumber() != null
                        ? accountDTO.getAccountNumber()
                        : String.valueOf(System.currentTimeMillis()))
                .userId(userId)
                .accountType(Account.AccountType.valueOf(accountDTO.getAccountType().toUpperCase()))
                .balance(accountDTO.getBalance() != null ? accountDTO.getBalance() : java.math.BigDecimal.ZERO)
                .interestRate(accountDTO.getInterestRate() != null ? accountDTO.getInterestRate() : java.math.BigDecimal.ZERO)
                .createdAt(java.time.LocalDateTime.now())
                .isActive(true)
                .build();
        
        Account saved = accountRepository.save(account);
        return convertToDTO(saved);
    }

    @Override
    public AccountDTO getAccountById(String id) {
        return accountRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));
    }

    @Override
    public AccountDTO getAccountByNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber)
                .map(this::convertToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with number: " + accountNumber));
    }

    public List<AccountDTO> getAllAccounts() {
        return accountRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AccountDTO> getAccountsByUserId(String userId) {
        return accountRepository.findByUserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AccountDTO updateAccount(String id, AccountDTO accountDTO) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));

        if (accountDTO.getAccountNumber() != null) {
            account.setAccountNumber(accountDTO.getAccountNumber());
        }

        if (accountDTO.getAccountType() != null) {
            account.setAccountType(Account.AccountType.valueOf(accountDTO.getAccountType().toUpperCase()));
        }

        if (accountDTO.getBalance() != null) {
            account.setBalance(accountDTO.getBalance());
        }

        if (accountDTO.getInterestRate() != null) {
            account.setInterestRate(accountDTO.getInterestRate());
        }

        if (accountDTO.getIsActive() != null) {
            account.setIsActive(accountDTO.getIsActive());
        }

        account.setLastModified(java.time.LocalDateTime.now());
        Account saved = accountRepository.save(account);
        return convertToDTO(saved);
    }

    @Override
    public void deleteAccount(String id) {
        if (!accountRepository.existsById(id)) {
            throw new ResourceNotFoundException("Account not found with id: " + id);
        }
        accountRepository.deleteById(id);
    }

    private AccountDTO convertToDTO(Account account) {
        return AccountDTO.builder()
                .id(account.getId())
                .userId(account.getUserId())
                .accountNumber(account.getAccountNumber())
                .accountType(account.getAccountType().name())
                .balance(account.getBalance())
                .interestRate(account.getInterestRate())
                .createdAt(account.getCreatedAt())
                .lastModified(account.getLastModified())
                .isActive(account.getIsActive())
                .build();
    }
}
