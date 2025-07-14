package com.financeapp.financeapp.controller;

import com.financeapp.financeapp.dto.RegisterRequest;
import com.financeapp.financeapp.dto.LoginRequest;
import com.financeapp.financeapp.service.UserService;
import com.financeapp.financeapp.models.User;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    public record UserResponse(Long id, String username, String email) {}

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            if (request.getUsername() == null || request.getUsername().trim().isEmpty() ||
                request.getEmail() == null || request.getEmail().trim().isEmpty() ||
                request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Todos os Campos são Obrigatórios"));
            }

            User user = userService.registerUser(request);
            UserResponse response = new UserResponse(user.getId(), user.getUsername(), user.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        try {
            if (request.getEmail() == null || request.getEmail().trim().isEmpty() ||
                request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Todos os Campos são Obrigatórios"));
            }

            User user = userService.loginUser(request);
            UserResponse userResponse = new UserResponse(user.getId(), user.getUsername(), user.getEmail());

            Cookie cookie = new Cookie("userId", String.valueOf(user.getId()));
            cookie.setPath("/");
            cookie.setHttpOnly(true);
            cookie.setMaxAge(7 * 24 * 60 * 60);
            response.addCookie(cookie);

            return ResponseEntity.ok(userResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getLoggedUser(@CookieValue(value = "userId", defaultValue = "-1") String userIdStr) {
        try {
            long userId = Long.parseLong(userIdStr);
            User user = userService.getUserById(userId);
            UserResponse userResponse = new UserResponse(user.getId(), user.getUsername(), user.getEmail());
            return ResponseEntity.ok(userResponse);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Cookie Inválido"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("userId", "");
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0); 
        response.addCookie(cookie);
        return ResponseEntity.ok(Map.of("message", "Logout Realizado com Sucesso"));
    }
}
