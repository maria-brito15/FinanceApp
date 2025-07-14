package com.financeapp.financeapp.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "transaction_seq")
    @SequenceGenerator(name = "transaction_seq", sequenceName = "transaction_sequence", allocationSize = 1)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, name = "date")
    private LocalDateTime dateTime;

    @Column(nullable = false, name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // MANY TO ONE RELATIONSHIPS
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    // CONSTRUCTORS
    public Transaction() {}

    public Transaction(User user, Category category, String title, BigDecimal amount) {
        this.user = user;
        this.category = category;
        this.title = title;
        this.amount = amount;
        this.dateTime = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
    }

    public Transaction(User user, Category category, String title, BigDecimal amount, LocalDateTime dateTime) {
        this.user = user;
        this.category = category;
        this.title = title;
        this.amount = amount;
        this.dateTime = dateTime != null ? dateTime : LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
    }

    // GETTERS AND SETTERS
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public LocalDateTime getDateTime() { return dateTime; }
    public void setDateTime(LocalDateTime dateTime) { this.dateTime = dateTime; }

    public LocalDateTime getDate() { return dateTime; }
    public void setDate(LocalDateTime date) { this.dateTime = date; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
}