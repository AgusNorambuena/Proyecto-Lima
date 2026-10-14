package com.escuela.Lima.service;

import com.escuela.Lima.model.Password;
import com.escuela.Lima.model.User;
import com.escuela.Lima.repository.PasswordRepository;
import com.escuela.Lima.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PasswordService {

    private final PasswordRepository passwordItemRepository;
    private final UserRepository userRepository;

    public PasswordService(PasswordRepository passwordItemRepository, UserRepository userRepository) {
        this.passwordItemRepository = passwordItemRepository;
        this.userRepository = userRepository;
    }

    // 1. Guardar una contraseña vinculándola al usuario
    public Password savePassword(Long userId, Password passwordItem) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + userId));

        passwordItem.setUser(user);
        return passwordItemRepository.save(passwordItem);
    }

    // 2. Obtener las contraseñas de un usuario específico
    public List<Password> getPasswordsByUserId(Long userId) {
        return passwordItemRepository.findByUserId(userId);
    }

    // 3. Obtener una contraseña específica validando al dueño
    public Password getPasswordByIdAndUserId(Long passwordId, Long userId) {
        return passwordItemRepository.findByIdAndUserId(passwordId, userId)
                .orElseThrow(() -> new RuntimeException("Contraseña no encontrada o no pertenece al usuario."));
    }

    // 4. ACTUALIZAR una contraseña existente
    public Password updatePassword(Long passwordId, Long userId, Password passwordDetails) {
        // Buscamos la contraseña y verificamos que sea de ese usuario
        Password passwordExistente = passwordItemRepository.findByIdAndUserId(passwordId, userId)
                .orElseThrow(() -> new RuntimeException("Contraseña no encontrada o no pertenece al usuario."));

        // Actualizamos los datos con lo que viene en el JSON
        passwordExistente.setUsuarioCuenta(passwordDetails.getUsuarioCuenta());
        passwordExistente.setPassword(passwordDetails.getPassword());
        passwordExistente.setNombre(passwordDetails.getNombre());
        passwordExistente.setCategoria(passwordDetails.getCategoria());

        // Guardamos los cambios. El @PreUpdate de tu entidad actualizará la fecha sola.
        return passwordItemRepository.save(passwordExistente);
    }

    // 5. Eliminar asegurando que la contraseña pertenezca realmente al usuario
    public void deletePassword(Long passwordId, Long userId) {
        Password password = passwordItemRepository.findByIdAndUserId(passwordId, userId)
                .orElseThrow(() -> new RuntimeException("Contraseña no encontrada o no pertenece al usuario."));

        passwordItemRepository.delete(password);
    }
}