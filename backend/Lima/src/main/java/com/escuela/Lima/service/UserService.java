package com.escuela.Lima.service;

import com.escuela.Lima.dto.LoginRequestDto;
import com.escuela.Lima.dto.RegisterRequestDto;
import com.escuela.Lima.dto.UserResponseDto;
import com.escuela.Lima.model.User;
import com.escuela.Lima.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    // Registrar un nuevo usuario con contraseña hasheada usando DTOs
    public UserResponseDto registerUser(RegisterRequestDto dto) {
        Optional<User> existingUser = userRepository.findByEmail(dto.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("El correo electrónico ya está en uso.");
        }

        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setBiometricEnabled(dto.getBiometricEnabled() != null ? dto.getBiometricEnabled() : false);

        User savedUser = userRepository.save(user);
        return new UserResponseDto(savedUser.getId(), savedUser.getEmail(), savedUser.getBiometricEnabled());
    }

    // Autenticar usuario usando DTOs de login
    public UserResponseDto login(LoginRequestDto dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado en la BD!"));

        // Verificar si la contraseña ingresada coincide con el hash almacenado
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta.");
        }

        // Devolvemos el DTO de respuesta limpio sin exponer la contraseña
        return new UserResponseDto(user.getId(), user.getEmail(), user.getBiometricEnabled());
    }

    // Buscar usuario por correo y mapearlo a ResponseDto
    public Optional<UserResponseDto> findByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(user -> new UserResponseDto(user.getId(), user.getEmail(), user.getBiometricEnabled()));
    }

    // Verificar si la contraseña ingresada coincide con la de la base de datos
    public boolean verificarPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}