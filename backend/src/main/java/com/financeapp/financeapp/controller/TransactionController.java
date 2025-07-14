package com.financeapp.financeapp.controller;

import com.financeapp.financeapp.dto.TransactionRequest;
import com.financeapp.financeapp.dto.TransactionResponse;
import com.financeapp.financeapp.service.TransactionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping
    public ResponseEntity<?> getUserTransactions(@CookieValue("userId") Long userId) {
        try {
            System.out.println("Fetching Transactions for User ID: " + userId);
            List<TransactionResponse> transactions = transactionService.getTransactionsByUserId(userId);
            System.out.println("Successfully Fetched " + transactions.size() + " transactions");
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            System.err.println("Error in getUserTransactions: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro Interno do Servidor: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createTransaction(@RequestBody TransactionRequest request) {
        try {
            System.out.println("Creating transaction: " + request.getTitle());
            Optional<TransactionResponse> savedTransaction = transactionService.createTransaction(request);

            if (savedTransaction.isEmpty()) {
                return ResponseEntity.badRequest().body("Usuário ou Categoria não Encontrados.");
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(savedTransaction.get());
        } catch (Exception e) {
            System.err.println("Error Creating Transaction: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro Interno do Servidor: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id) {
        try {
            System.out.println("Deleting transaction ID: " + id);
            boolean deleted = transactionService.deleteTransaction(id);

            if (!deleted) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            System.err.println("Error Deleting Transaction: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro Interno do Servidor: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTransaction(@PathVariable Long id, @RequestBody TransactionRequest request) {
        try {
            System.out.println("Updating Transaction ID: " + id);
            Optional<TransactionResponse> updatedTransaction = transactionService.updateTransaction(id, request);
            
            if (updatedTransaction.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(updatedTransaction.get());
        } catch (Exception e) {
            System.err.println("Error Updating Transaction: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro Interno do Servidor: " + e.getMessage());
        }
    }
}