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
        // Verificar si el correo ya existe
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("El correo electrónico ya está registrado.");
        }

        // Hashear la contraseña antes de guardarla
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);

        return userRepository.save(user);
    }

    // Buscar usuario por email (utilizado en el login)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Verificar si la contraseña ingresada coincide con la de la base de datos
    public boolean verificarPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}