package com.financeapp.financeapp.models;

import java.util.List;
import jakarta.persistence.*;


@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "category_seq")
    @SequenceGenerator(name = "category_seq", sequenceName = "category_sequence", allocationSize = 1)
    private Long id;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    @Column(nullable = false, length = 50)
    private String name;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    @Column(nullable = false, length = 10)
    private String type;

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    // ONE TO MANY
    
    // 1 category to many transactions
    @OneToMany(mappedBy = "category")
    private java.util.List<Transaction> transactions = new java.util.ArrayList<>();

    public List<Transaction> getTransactions() { return transactions; }
    public void setTransactions(List<Transaction> transactions) { this.transactions = transactions; }

    //

    // CONSTRUCTOR

    public Category() {}

    public Category(String name, String type) {
        this.name = name;
        this.type = type;
    }

    //
}
