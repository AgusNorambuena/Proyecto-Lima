package com.escuela.Lima.service;

import com.escuela.Lima.dto.EventoRequestDto;
import com.escuela.Lima.dto.EventoResponseDto;
import com.escuela.Lima.model.Evento;
import com.escuela.Lima.model.User;
import com.escuela.Lima.repository.EventoRepository;
import com.escuela.Lima.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventoService {

    private final EventoRepository eventoRepository;
    private final UserRepository userRepository;

    public EventoService(EventoRepository eventoRepository, UserRepository userRepository) {
        this.eventoRepository = eventoRepository;
        this.userRepository = userRepository;
    }

    private EventoResponseDto mapToDto(Evento e) {
        return new EventoResponseDto(
                e.getId(),
                e.getTitulo(),
                e.getFecha(),
                e.getHora(),
                e.getCompletado(),
                e.getFechaCreacion()
        );
    }

    // 1. Guardar un evento usando DTOs
    public EventoResponseDto saveEvento(Long userId, EventoRequestDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + userId));

        Evento evento = new Evento();
        evento.setTitulo(dto.getTitulo());
        evento.setFecha(dto.getFecha());
        evento.setHora(dto.getHora());
        evento.setCompletado(dto.getCompletado() != null ? dto.getCompletado() : false);
        evento.setUser(user);

        Evento saved = eventoRepository.save(evento);
        return mapToDto(saved);
    }

    // 2. Obtener todos los eventos mapeados a DTO
    public List<EventoResponseDto> getEventosByUserId(Long userId) {
        return eventoRepository.findByUserId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // 3. Obtener eventos por fecha mapeados a DTO
    public List<EventoResponseDto> getEventosByUserIdAndFecha(Long userId, LocalDate fecha) {
        return eventoRepository.findByUserIdAndFecha(userId, fecha).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // 4. Actualizar evento usando DTOs
    public EventoResponseDto updateEvento(Long eventoId, Long userId, EventoRequestDto dto) {
        Evento eventoExistente = eventoRepository.findByIdAndUserId(eventoId, userId)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado o no pertenece al usuario."));

        eventoExistente.setTitulo(dto.getTitulo());
        eventoExistente.setFecha(dto.getFecha());
        eventoExistente.setHora(dto.getHora());
        if (dto.getCompletado() != null) {
            eventoExistente.setCompletado(dto.getCompletado());
        }

        Evento updated = eventoRepository.save(eventoExistente);
        return mapToDto(updated);
    }

    // 5. Eliminar evento
    public void deleteEvento(Long eventoId, Long userId) {
        Evento evento = eventoRepository.findByIdAndUserId(eventoId, userId)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado o no pertenece al usuario."));

        eventoRepository.delete(evento);
    }
}