package com.financeapp.financeapp.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionRequest {
    private Long userId;
    
    private Long categoryId;
    
    private String title;
    
    private BigDecimal amount;
    
    private LocalDateTime dateTime;
    
    // Default constructor
    public TransactionRequest() {}
    
    // Constructor with all fields
    public TransactionRequest(Long userId, Long categoryId, String title, BigDecimal amount, LocalDateTime dateTime) {
        this.userId = userId;
        this.categoryId = categoryId;
        this.title = title;
        this.amount = amount;
        this.dateTime = dateTime;
    }
    
    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    
    public LocalDateTime getDateTime() { return dateTime; }
    public void setDateTime(LocalDateTime dateTime) { this.dateTime = dateTime; }
}