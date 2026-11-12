package com.escuela.Lima.controller;

import com.escuela.Lima.dto.EventoRequestDto;
import com.escuela.Lima.dto.EventoResponseDto;
import com.escuela.Lima.service.EventoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/eventos")
@CrossOrigin(origins = "*")
public class EventoController {

    private final EventoService eventoService;

    public EventoController(EventoService eventoService) {
        this.eventoService = eventoService;
    }

    // 1. Crear un nuevo evento para un usuario
    @PostMapping("/user/{userId}")
    public ResponseEntity<EventoResponseDto> createEvento(
            @PathVariable Long userId,
            @RequestBody EventoRequestDto requestDto) {
        EventoResponseDto nuevoEvento = eventoService.saveEvento(userId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoEvento);
    }

    // 2. Obtener todos los eventos de un usuario
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<EventoResponseDto>> getEventosByUser(@PathVariable Long userId) {
        List<EventoResponseDto> eventos = eventoService.getEventosByUserId(userId);
        return ResponseEntity.ok(eventos);
    }

    // 3. Actualizar un evento
    @PutMapping("/{eventoId}/user/{userId}")
    public ResponseEntity<EventoResponseDto> updateEvento(
            @PathVariable Long eventoId,
            @PathVariable Long userId,
            @RequestBody EventoRequestDto requestDto) {
        EventoResponseDto eventoActualizado = eventoService.updateEvento(eventoId, userId, requestDto);
        return ResponseEntity.ok(eventoActualizado);
    }

    // 4. Eliminar un evento
    @DeleteMapping("/{eventoId}/user/{userId}")
    public ResponseEntity<Void> deleteEvento(
            @PathVariable Long eventoId,
            @PathVariable Long userId) {
        eventoService.deleteEvento(eventoId, userId);
        return ResponseEntity.noContent().build();
    }
}