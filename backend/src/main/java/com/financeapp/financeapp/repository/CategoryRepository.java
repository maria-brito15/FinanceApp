package com.financeapp.financeapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.financeapp.financeapp.models.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
  
}
