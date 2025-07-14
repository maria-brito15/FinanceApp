package com.financeapp.financeapp.service;

import com.financeapp.financeapp.dto.LoginRequest;
import com.financeapp.financeapp.dto.RegisterRequest;
import com.financeapp.financeapp.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.NoSuchElementException;

import com.financeapp.financeapp.repository.UserRepository;


@Service
public class UserService {
  @Autowired
  private UserRepository userRepository;
  private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  public User registerUser(RegisterRequest request) throws Exception {
    if (userRepository.existsByEmail(request.getEmail()))  {
      throw new Exception ("Email já  Cadastrado");
    } else if (userRepository.existsByUsername(request.getUsername())) {
      throw new Exception("Username já Cadastrado");
    }

    User user = new User();
    user.setUsername(request.getUsername());
    user.setEmail(request.getEmail());
    user.setPasswordHash(hashPassword(request.getPassword()));

    return userRepository.save(user);
  }

  public User loginUser(LoginRequest request) throws Exception {
      User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new Exception("Usuário não Encontrado."));

      boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());

      if (!passwordMatches) {
          throw new Exception("Senha Incorreta");
      }

      return user;
  }

  private String hashPassword(String password) {
      return passwordEncoder.encode(password);
  }

  public User getUserById(Long id) {
    return userRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Usuário não Encontrado."));
  }

  public User saveUser(User user) {
    return userRepository.save(user);
  }
}
