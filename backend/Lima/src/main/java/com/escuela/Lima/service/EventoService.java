package com.escuela.Lima.service;

import com.escuela.Lima.model.Evento;
import com.escuela.Lima.model.User;
import com.escuela.Lima.repository.EventoRepository;
import com.escuela.Lima.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class EventoService {

    private final EventoRepository eventoRepository;
    private final UserRepository userRepository;

    public EventoService(EventoRepository eventoRepository, UserRepository userRepository) {
        this.eventoRepository = eventoRepository;
        this.userRepository = userRepository;
    }

    // 1. Guardar un evento vinculado al usuario
    public Evento saveEvento(Long userId, Evento evento) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + userId));

        evento.setUser(user);
        return eventoRepository.save(evento);
    }

    // 2. Obtener todos los eventos de un usuario
    public List<Evento> getEventosByUserId(Long userId) {
        return eventoRepository.findByUserId(userId);
    }

    // 3. Obtener eventos de un usuario por fecha específica
    public List<Evento> getEventosByUserIdAndFecha(Long userId, LocalDate fecha) {
        return eventoRepository.findByUserIdAndFecha(userId, fecha);
    }

    // 4. Actualizar un evento validando al dueño
    public Evento updateEvento(Long eventoId, Long userId, Evento eventoDetails) {
        Evento eventoExistente = eventoRepository.findByIdAndUserId(eventoId, userId)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado o no pertenece al usuario."));

        eventoExistente.setTitulo(eventoDetails.getTitulo());
        eventoExistente.setFecha(eventoDetails.getFecha());
        eventoExistente.setHora(eventoDetails.getHora());
        if (eventoDetails.getCompletado() != null) {
            eventoExistente.setCompletado(eventoDetails.getCompletado());
        }

        return eventoRepository.save(eventoExistente);
    }

    // 5. Eliminar un evento asegurando que pertenezca al usuario
    public void deleteEvento(Long eventoId, Long userId) {
        Evento evento = eventoRepository.findByIdAndUserId(eventoId, userId)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado o no pertenece al usuario."));

        eventoRepository.delete(evento);
    }
}