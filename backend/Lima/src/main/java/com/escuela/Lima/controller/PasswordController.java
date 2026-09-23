package com.escuela.Lima.controller;

import com.escuela.Lima.model.Password;
import com.escuela.Lima.service.PasswordService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/passwords")
public class PasswordController {

    private final PasswordService passwordService;

    public PasswordController(PasswordService passwordService) {
        this.passwordService = passwordService;
    }

    // Obtener la lista de contraseñas de un usuario
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Password>> getUserPasswords(@PathVariable Long userId) {
        return ResponseEntity.ok(passwordService.getPasswordsByUser(userId));
    }

    // Guardar una nueva contraseña en la bóveda
    @PostMapping
    public ResponseEntity<Password> createPassword(@RequestBody Password passwordItem) {
        Password saved = passwordService.savePassword(passwordItem);
        return ResponseEntity.ok(saved);
    }

    // Eliminar una contraseña de la bóveda
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePassword(@PathVariable Long id) {
        passwordService.deletePassword(id);
        return ResponseEntity.noContent().build();
    }
}