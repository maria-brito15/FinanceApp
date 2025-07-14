package com.financeapp.financeapp.service;

import com.financeapp.financeapp.models.Transaction;
import com.financeapp.financeapp.dto.TransactionRequest;
import com.financeapp.financeapp.dto.TransactionResponse;
import com.financeapp.financeapp.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.financeapp.financeapp.models.User;
import com.financeapp.financeapp.models.Category;
import com.financeapp.financeapp.repository.UserRepository;
import com.financeapp.financeapp.repository.CategoryRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository; 

    @Autowired
    private CategoryRepository categoryRepository;

    public List<TransactionResponse> getTransactionsByUserId(Long userId) {
        try {
            List<Transaction> transactions = transactionRepository.findByUserId(userId);

            return transactions.stream()
                .map(tx -> {
                    try {
                        return new TransactionResponse(
                            tx.getId(),
                            tx.getTitle(),
                            tx.getAmount(),
                            tx.getDateTime(),
                            tx.getCategory() != null ? tx.getCategory().getId() : null
                        );
                    } catch (Exception e) {
                        System.err.println("Error Mapping Transaction ID " + tx.getId() + ": " + e.getMessage());
                        e.printStackTrace();
                        
                        return new TransactionResponse(
                            tx.getId(),
                            tx.getTitle() != null ? tx.getTitle() : "Unknown",
                            tx.getAmount() != null ? tx.getAmount() : java.math.BigDecimal.ZERO,
                            tx.getDateTime() != null ? tx.getDateTime() : LocalDateTime.now(),
                            null
                        );
                    }
                })
                .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error in getTransactionsByUserId: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to Fetch Transactions", e);
        }
    }

    public boolean deleteTransaction(Long id) {
        try {
            if (!transactionRepository.existsById(id)) {
                return false;
            }
            transactionRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            System.err.println("Error Deleting Transaction: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to Delete Transaction", e);
        }
    }

    public Optional<TransactionResponse> createTransaction(TransactionRequest request) {
        try {
            Optional<User> userOpt = userRepository.findById(request.getUserId());
            Optional<Category> categoryOpt = categoryRepository.findById(request.getCategoryId());

            if (userOpt.isEmpty() || categoryOpt.isEmpty()) {
                return Optional.empty();
            }

            LocalDateTime transactionDateTime = request.getDateTime() != null ? 
                request.getDateTime() : LocalDateTime.now();

            Transaction transaction = new Transaction(
                userOpt.get(),
                categoryOpt.get(),
                request.getTitle(),
                request.getAmount(),
                transactionDateTime
            );

            Transaction savedTransaction = transactionRepository.save(transaction);

            TransactionResponse response = new TransactionResponse(
                savedTransaction.getId(),
                savedTransaction.getTitle(),
                savedTransaction.getAmount(),
                savedTransaction.getDateTime(),
                savedTransaction.getCategory().getId()
            );

            return Optional.of(response);
        } catch (Exception e) {
            System.err.println("Error Creating Transaction: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to Create Transaction", e);
        }
    }
    
    public Optional<TransactionResponse> updateTransaction(Long id, TransactionRequest request) {
        try {
            Optional<Transaction> transactionOpt = transactionRepository.findById(id);
            
            if (transactionOpt.isEmpty()) {
                return Optional.empty();
            }
            
            Optional<User> userOpt = userRepository.findById(request.getUserId());
            Optional<Category> categoryOpt = categoryRepository.findById(request.getCategoryId());

            if (userOpt.isEmpty() || categoryOpt.isEmpty()) {
                return Optional.empty();
            }
            
            Transaction transaction = transactionOpt.get();
            transaction.setTitle(request.getTitle());
            transaction.setAmount(request.getAmount());
            transaction.setDateTime(request.getDateTime() != null ? request.getDateTime() : transaction.getDateTime());
            transaction.setUser(userOpt.get());
            transaction.setCategory(categoryOpt.get());
            
            Transaction updatedTransaction = transactionRepository.save(transaction);
            
            TransactionResponse response = new TransactionResponse(
                updatedTransaction.getId(),
                updatedTransaction.getTitle(),
                updatedTransaction.getAmount(),
                updatedTransaction.getDateTime(),
                updatedTransaction.getCategory().getId()
            );
            
            return Optional.of(response);
        } catch (Exception e) {
            System.err.println("Error Updating Transaction: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to Update Transaction", e);
        }
    }
}