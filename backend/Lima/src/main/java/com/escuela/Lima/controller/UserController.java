package com.escuela.Lima.controller;

import com.escuela.Lima.model.User;
import com.escuela.Lima.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*") // Permite peticiones desde la app móvil en tu red local
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
            return ResponseEntity.ok(newUser); // Retorna el JSON del usuario
        } catch (RuntimeException e) {
            // Retornamos un JSON válido para el error en lugar de un String
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // Endpoint de Login básico (sin JWT)
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        System.out.println("Intentando login para usuario: " + loginRequest.getUsername());
    System.out.println("Password recibida: " + loginRequest.getPassword());

    Optional<User> userOpt = userService.findByUsername(loginRequest.getUsername());
    if (userOpt.isPresent()) {
        System.out.println("¡Usuario encontrado en la BD!");
        // ... validación de password
    } else {
        System.out.println("El usuario NO existe en la BD.");
    }


        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Comparamos la contraseña en texto plano con el hash de la BD
            boolean isValid = userService.verificarPassword(loginRequest.getPassword(), user.getPassword());

            if (isValid) {
                // SOLUCIÓN: Devolvemos el objeto Usuario directamente (se convertirá en JSON)
                user.setPassword(null);
                return ResponseEntity.ok(user);
            }
        }

        // Retornamos un JSON válido para credenciales inválidas en lugar de un String
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Credenciales inválidas.");
        return ResponseEntity.status(401).body(errorResponse);
    }
}