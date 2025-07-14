package com.financeapp.financeapp.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
    @SequenceGenerator(name = "user_seq", sequenceName = "user_sequence", allocationSize = 1)
    private Long id;

    public long getId() {return id;}
    public void setId(Long id) {this.id = id;}

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    public String getUsername() {return username;}
    public void  setUsername(String username) {this.username = username;}

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    public String getEmail() {return email;}
    public void  setEmail(String email) {this.email = email;}

    @Column(nullable = false, unique = true, length = 255)
    private String passwordHash;

    public String getPasswordHash() {return passwordHash;}
    public void  setPasswordHash(String passwordHash) {this.passwordHash = passwordHash;}

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public LocalDateTime getCreatedAt() {return createdAt;}
    public void setCreatedAt(LocalDateTime createdAt) {this.createdAt = createdAt;}
    
    // ONE TO MANY

    // 1 user to many transactions
    @OneToMany(mappedBy = "user")
    private List<Transaction> transactions = new ArrayList<>();

    public List<Transaction> getTransactions() { return transactions; }
    public void setTransactions(List<Transaction> transactions) { this.transactions = transactions; }

    //

    // CONSTRUCTOR

    public User() {}

    public User(String username, String email, String passwordHash) {
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.createdAt = LocalDateTime.now();
    }

    //
}
