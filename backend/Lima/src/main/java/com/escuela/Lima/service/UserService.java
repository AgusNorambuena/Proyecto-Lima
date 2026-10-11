package com.escuela.Lima.service;

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

    // Registrar un nuevo usuario con contraseña hasheada
    public User registerUser(User user) {
        // Verificar si el nombre de usuario ya existe
        Optional<User> existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser.isPresent()) {
            throw new RuntimeException("El nombre de usuario ya está en uso.");
        }

        // Hashear la contraseña antes de guardarla
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);

        return userRepository.save(user);
    }

    // Buscar usuario por nombre de usuario (utilizado en el login)
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // Verificar si la contraseña ingresada coincide con la de la base de datos
    public boolean verificarPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}