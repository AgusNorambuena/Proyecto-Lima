package com.escuela.Lima.controller;

import com.escuela.Lima.model.Password;
import com.escuela.Lima.service.PasswordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/passwords")
public class PasswordController {

    @Autowired
    private PasswordService passwordService;

    // 1. Crear una nueva contraseña
    @PostMapping("/user/{userId}")
    public ResponseEntity<Password> createPassword(@PathVariable Long userId, @RequestBody Password password) {
        Password nuevaPassword = passwordService.savePassword(userId, password);
        return new ResponseEntity<>(nuevaPassword, HttpStatus.CREATED);
    }

    // 2. Obtener todas las contraseñas de un usuario
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Password>> getPasswordsByUser(@PathVariable Long userId) {
        List<Password> passwords = passwordService.getPasswordsByUserId(userId);
        return new ResponseEntity<>(passwords, HttpStatus.OK);
    }

    // 3. Obtener una contraseña específica de un usuario
    @GetMapping("/{passwordId}/user/{userId}")
    public ResponseEntity<Password> getPasswordByIdAndUser(@PathVariable Long passwordId, @PathVariable Long userId) {
        Password password = passwordService.getPasswordByIdAndUserId(passwordId, userId);
        return new ResponseEntity<>(password, HttpStatus.OK);
    }

    // 4. ACTUALIZAR una contraseña
    @PutMapping("/{passwordId}/user/{userId}")
    public ResponseEntity<Password> updatePassword(
            @PathVariable Long passwordId,
            @PathVariable Long userId,
            @RequestBody Password passwordDetails) {

        Password passwordActualizada = passwordService.updatePassword(passwordId, userId, passwordDetails);
        return new ResponseEntity<>(passwordActualizada, HttpStatus.OK);
    }

    // 5. Eliminar una contraseña
    @DeleteMapping("/{passwordId}/user/{userId}")
    public ResponseEntity<String> deletePassword(@PathVariable Long passwordId, @PathVariable Long userId) {
        passwordService.deletePassword(passwordId, userId);
        return new ResponseEntity<>("Contraseña eliminada correctamente.", HttpStatus.OK);
    }
}