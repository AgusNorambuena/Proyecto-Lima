package com.escuela.Lima.repository;

import com.escuela.Lima.model.Password;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional; // Asegúrate de importar Optional

@Repository
public interface PasswordRepository extends JpaRepository<Password, Long> {

    // Trae todas las contraseñas de un usuario
    List<Password> findByUserId(Long userId);

    // Busca una contraseña específica asegurando que pertenezca al usuario indicado
    Optional<Password> findByIdAndUserId(Long id, Long userId);
}