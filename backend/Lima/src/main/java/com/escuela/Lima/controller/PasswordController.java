package com.escuela.Lima.controller;

import com.escuela.Lima.dto.PasswordRequestDto;
import com.escuela.Lima.dto.PasswordResponseDto;
import com.escuela.Lima.service.PasswordService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/passwords")
@CrossOrigin(origins = "*")
public class PasswordController {

    private final PasswordService passwordService;

    public PasswordController(PasswordService passwordService) {
        this.passwordService = passwordService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PasswordResponseDto>> getPasswordsByUserId(@PathVariable Long userId) {
        List<PasswordResponseDto> passwords = passwordService.getPasswordsByUserId(userId);
        return ResponseEntity.ok(passwords);
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<PasswordResponseDto> createPassword(@PathVariable Long userId, @RequestBody PasswordRequestDto requestDto) {
        PasswordResponseDto nueva = passwordService.savePassword(userId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
    }

    @PutMapping("/{passwordId}/user/{userId}")
    public ResponseEntity<PasswordResponseDto> updatePassword(
            @PathVariable Long passwordId,
            @PathVariable Long userId,
            @RequestBody PasswordRequestDto requestDto) {
        PasswordResponseDto actualizada = passwordService.updatePassword(passwordId, userId, requestDto);
        return ResponseEntity.ok(actualizada);
    }

    @DeleteMapping("/{passwordId}/user/{userId}")
    public ResponseEntity<Void> deletePassword(@PathVariable Long passwordId, @PathVariable Long userId) {
        passwordService.deletePassword(passwordId, userId);
        return ResponseEntity.noContent().build();
    }
}