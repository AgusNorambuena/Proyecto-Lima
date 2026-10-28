package com.escuela.Lima.controller;

import com.escuela.Lima.dto.LoginRequestDto;
import com.escuela.Lima.dto.RegisterRequestDto;
import com.escuela.Lima.dto.UserResponseDto;
import com.escuela.Lima.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Endpoint de Registro actualizado a RegisterRequestDto
    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> registerUser(@RequestBody RegisterRequestDto requestDto) {
        UserResponseDto nuevoUsuario = userService.registerUser(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
    }

    // Endpoint de Login actualizado a LoginRequestDto
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequestDto loginRequest) {
        System.out.println("Intentando login para usuario: " + loginRequest.getEmail());
        System.out.println("Password recibida: " + loginRequest.getPassword());

        try {
            UserResponseDto userResponse = userService.login(loginRequest);
            System.out.println("¡Usuario autenticado con éxito!");
            return ResponseEntity.ok(userResponse);
        } catch (RuntimeException e) {
            System.out.println("Error en login: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}