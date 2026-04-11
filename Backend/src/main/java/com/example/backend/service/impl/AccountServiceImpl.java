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
                .accountNumber(accountDTO.getAccountNumber())
                .userId(userId)
                .accountType(Account.AccountType.valueOf(accountDTO.getAccountType()))
                .balance(accountDTO.getBalance())
                .interestRate(accountDTO.getInterestRate())
                .createdAt(java.time.LocalDateTime.now())
                .isActive(true)
                .build();
        
        Account saved = accountRepository.save(account);
        return convertToDTO(saved);
    }

    @Override
    public AccountDTO getAccountById(Long id) {
        throw new ResourceNotFoundException("String ID expected, not Long");
    }

    @Override
    public AccountDTO getAccountByNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber)
                .map(this::convertToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with number: " + accountNumber));
    }

    @Override
    public List<AccountDTO> getAccountsByUserId(String userId) {
        return accountRepository.findByUserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AccountDTO updateAccount(Long id, AccountDTO accountDTO) {
        throw new ResourceNotFoundException("String ID expected, not Long");
    }

    @Override
    public void deleteAccount(Long id) {
        throw new ResourceNotFoundException("String ID expected, not Long");
    }

    private AccountDTO convertToDTO(Account account) {
        return AccountDTO.builder()
                .id(account.getId())
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
