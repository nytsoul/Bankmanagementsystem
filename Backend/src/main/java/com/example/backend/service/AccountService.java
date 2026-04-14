package com.example.backend.service;

import com.example.backend.dto.AccountDTO;
import java.util.List;

public interface AccountService {
    AccountDTO createAccount(AccountDTO accountDTO, String userId);
    AccountDTO getAccountById(String id);
    AccountDTO getAccountByNumber(String accountNumber);
    List<AccountDTO> getAllAccounts();
    List<AccountDTO> getAccountsByUserId(String userId);
    AccountDTO updateAccount(String id, AccountDTO accountDTO);
    void deleteAccount(String id);
}
