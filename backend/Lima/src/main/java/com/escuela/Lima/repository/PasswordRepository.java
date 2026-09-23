package com.escuela.Lima.repository;

import com.escuela.Lima.model.Password;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PasswordRepository extends JpaRepository<Password, Long> {
    // Buscar todas las contraseñas pertenecientes a un usuario específico
    List<Password> findByUserId(Long userId);
}