package com.escuela.Lima.repository;

import com.escuela.Lima.model.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {

    // Obtener todos los eventos de un usuario
    List<Evento> findByUserId(Long userId);

    // Obtener eventos de un usuario filtrados por una fecha específica
    List<Evento> findByUserIdAndFecha(Long userId, LocalDate fecha);

    // Buscar un evento específico asegurando que pertenezca al usuario (para actualizar o eliminar con seguridad)
    Optional<Evento> findByIdAndUserId(Long id, Long userId);
}