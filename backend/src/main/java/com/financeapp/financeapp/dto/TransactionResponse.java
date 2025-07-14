package com.financeapp.financeapp.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionResponse {
    private Long id;
    private String title;
    private BigDecimal amount;
    private LocalDateTime dateTime;
    private Long categoryId;
    
    // Default constructor
    public TransactionResponse() {}
    
    // Constructor
    public TransactionResponse(Long id, String title, BigDecimal amount, LocalDateTime dateTime, Long categoryId) {
        this.id = id;
        this.title = title;
        this.amount = amount;
        this.dateTime = dateTime;
        this.categoryId = categoryId;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    
    public LocalDateTime getDateTime() { return dateTime; }
    public void setDateTime(LocalDateTime dateTime) { this.dateTime = dateTime; }
    
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
}