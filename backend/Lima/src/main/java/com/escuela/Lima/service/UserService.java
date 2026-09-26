package com.escuela.Lima.service;

import com.escuela.Lima.model.User;
import com.escuela.Lima.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    /*private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }*/

    // Registrar un nuevo usuario
    public User registerUser(User user) {
        // Verificar si el correo ya existe
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("El correo electrónico ya está registrado.");
        }

        // Hashear la contraseña antes de guardarla
        String hashedPassword = user.getPassword();
        user.setPassword(hashedPassword);

        return userRepository.save(user);
    }

    // Buscar usuario por email (útil para futuros logins)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}