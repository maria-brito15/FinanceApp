package com.financeapp.financeapp.seeders;

import com.financeapp.financeapp.models.Category;
import com.financeapp.financeapp.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class CategorySeeder implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() == 0) {
            categoryRepository.save(new Category("Salário", "entrada"));
            categoryRepository.save(new Category("Bônus", "entrada"));
            categoryRepository.save(new Category("Renda Extra", "entrada"));
            categoryRepository.save(new Category("Investimentos", "entrada"));
            categoryRepository.save(new Category("Venda de Produto", "entrada"));
            categoryRepository.save(new Category("Reembolso", "entrada"));
            categoryRepository.save(new Category("Presentes", "entrada"));

            categoryRepository.save(new Category("Alimentação", "saida"));
            categoryRepository.save(new Category("Moradia", "saida"));
            categoryRepository.save(new Category("Transporte", "saida"));
            categoryRepository.save(new Category("Saúde", "saida"));
            categoryRepository.save(new Category("Lazer", "saida"));
            categoryRepository.save(new Category("Educação", "saida"));
            categoryRepository.save(new Category("Contas", "saida"));
            categoryRepository.save(new Category("Vestuário", "saida"));
            categoryRepository.save(new Category("Impostos e Taxas", "saida"));
            categoryRepository.save(new Category("Empréstimos e Financiamentos", "saida"));
        }
    }
}
