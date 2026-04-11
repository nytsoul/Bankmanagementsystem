package com.example.backend.service;

import com.example.backend.dto.AccountDTO;
import com.example.backend.entity.Account;
import java.util.List;

public interface AccountService {
    AccountDTO createAccount(AccountDTO accountDTO, Long userId);
    AccountDTO getAccountById(Long id);
    AccountDTO getAccountByNumber(String accountNumber);
    List<AccountDTO> getAccountsByUserId(Long userId);
    AccountDTO updateAccount(Long id, AccountDTO accountDTO);
    void deleteAccount(Long id);
}
