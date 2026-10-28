package com.escuela.Lima.service;

import com.escuela.Lima.dto.PasswordRequestDto;
import com.escuela.Lima.dto.PasswordResponseDto;
import com.escuela.Lima.model.Password;
import com.escuela.Lima.model.User;
import com.escuela.Lima.repository.PasswordRepository;
import com.escuela.Lima.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PasswordService {

    private final PasswordRepository passwordItemRepository;
    private final UserRepository userRepository;

    public PasswordService(PasswordRepository passwordItemRepository, UserRepository userRepository) {
        this.passwordItemRepository = passwordItemRepository;
        this.userRepository = userRepository;
    }

    private PasswordResponseDto mapToDto(Password p) {
        return new PasswordResponseDto(
                p.getId(),
                p.getNombre(),
                p.getUsuarioCuenta(),
                p.getPassword(),
                p.getCategoria(),
                p.getFechaCreacion(),
                p.getFechaActualizacion()
        );
    }

    // 1. Guardar una contraseña usando DTOs
    public PasswordResponseDto savePassword(Long userId, PasswordRequestDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + userId));

        Password password = new Password();
        password.setNombre(dto.getNombre());
        password.setUsuarioCuenta(dto.getUsuarioCuenta());
        password.setPassword(dto.getPassword());
        password.setCategoria(dto.getCategoria());
        password.setUser(user);

        Password saved = passwordItemRepository.save(password);
        return mapToDto(saved);
    }

    // 2. Obtener las contraseñas mapeadas a DTO
    public List<PasswordResponseDto> getPasswordsByUserId(Long userId) {
        return passwordItemRepository.findByUserId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // 3. Obtener una contraseña específica mapeada a DTO
    public PasswordResponseDto getPasswordByIdAndUserId(Long passwordId, Long userId) {
        Password password = passwordItemRepository.findByIdAndUserId(passwordId, userId)
                .orElseThrow(() -> new RuntimeException("Contraseña no encontrada o no pertenece al usuario."));
        return mapToDto(password);
    }

    // 4. ACTUALIZAR una contraseña usando DTO
    public PasswordResponseDto updatePassword(Long passwordId, Long userId, PasswordRequestDto dto) {
        Password passwordExistente = passwordItemRepository.findByIdAndUserId(passwordId, userId)
                .orElseThrow(() -> new RuntimeException("Contraseña no encontrada o no pertenece al usuario."));

        passwordExistente.setNombre(dto.getNombre());
        passwordExistente.setUsuarioCuenta(dto.getUsuarioCuenta());
        passwordExistente.setPassword(dto.getPassword());
        passwordExistente.setCategoria(dto.getCategoria());

        Password updated = passwordItemRepository.save(passwordExistente);
        return mapToDto(updated);
    }

    // 5. Eliminar contraseña
    public void deletePassword(Long passwordId, Long userId) {
        Password password = passwordItemRepository.findByIdAndUserId(passwordId, userId)
                .orElseThrow(() -> new RuntimeException("Contraseña no encontrada o no pertenece al usuario."));

        passwordItemRepository.delete(password);
    }
}