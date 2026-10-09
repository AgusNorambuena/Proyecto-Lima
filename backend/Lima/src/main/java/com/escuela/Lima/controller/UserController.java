package com.escuela.Lima.controller;

import com.escuela.Lima.model.User;
import com.escuela.Lima.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Endpoint de Registro
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User newUser = userService.registerUser(user);
            // Ocultamos la contraseña en la respuesta por seguridad
            newUser.setPassword(null);
            return ResponseEntity.ok(newUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Endpoint de Login básico (sin JWT)
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        Optional<User> userOpt = userService.findByEmail(loginRequest.getEmail());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Comparamos la contraseña en texto plano con el hash de la BD
            boolean isValid = userService.verificarPassword(loginRequest.getPassword(), user.getPassword());

            if (isValid) {
                // Login exitoso (puedes devolver el ID y el email para que el cliente los use)
                return ResponseEntity.ok("Login exitoso. Bienvenido ID: " + user.getId());
            }
        }

        return ResponseEntity.status(401).body("Credenciales inválidas.");
    }
}