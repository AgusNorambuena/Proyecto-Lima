package com.escuela.Lima.repository;

import com.escuela.Lima.model.Password;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PasswordRepository extends JpaRepository<Password, Long> {

    // Trae las contraseñas de un usuario. Spring lo implementa solo:
    // "UserId" = campo `user` de Password + campo `id` de User.
    List<Password> findByUserId(Long userId);
}