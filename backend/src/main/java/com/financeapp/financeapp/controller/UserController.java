package com.financeapp.financeapp.controller;

import com.financeapp.financeapp.dto.UserRequest;
import com.financeapp.financeapp.controller.AuthController.UserResponse;
import com.financeapp.financeapp.models.User;
import com.financeapp.financeapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

  @PostMapping("/edit")
  public ResponseEntity<?> editProfile(
      @CookieValue(value = "userId", defaultValue = "-1") String userIdStr,
      @RequestBody UserRequest request) {
    try {
      long userId = Long.parseLong(userIdStr);
      User user = userService.getUserById(userId);
        
      if (request.getUsername() != null) {
        user.setUsername(request.getUsername());
      }

      if (request.getEmail() != null) {
          user.setEmail(request.getEmail());
      }
        
      User updatedUser = userService.saveUser(user);
      
      UserResponse userResponse = new UserResponse(
        updatedUser.getId(),
        updatedUser.getUsername(),
        updatedUser.getEmail()
      );
        
      return ResponseEntity.ok(userResponse);
    } catch (NumberFormatException e) {
      return ResponseEntity.badRequest().body(Map.of("error", "Cookie Inválido"));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
  }
}