package com.escuela.Lima.controller;

import com.escuela.Lima.model.Evento;
import com.escuela.Lima.service.EventoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/eventos")
public class EventoController {

    @Autowired
    private EventoService eventoService;

    // 1. Crear un nuevo evento para un usuario
    @PostMapping("/user/{userId}")
    public ResponseEntity<Evento> createEvento(@PathVariable Long userId, @RequestBody Evento evento) {
        Evento nuevoEvento = eventoService.saveEvento(userId, evento);
        return new ResponseEntity<>(nuevoEvento, HttpStatus.CREATED);
    }

    // 2. Obtener todos los eventos de un usuario
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Evento>> getEventosByUser(@PathVariable Long userId) {
        List<Evento> eventos = eventoService.getEventosByUserId(userId);
        return new ResponseEntity<>(eventos, HttpStatus.OK);
    }

    // 3. Obtener eventos de un usuario filtrados por fecha (Ej: /api/eventos/user/1/fecha/2026-10-15)
    @GetMapping("/user/{userId}/fecha/{fecha}")
    public ResponseEntity<List<Evento>> getEventosByFecha(
            @PathVariable Long userId,
            @PathVariable LocalDate fecha) {
        List<Evento> eventos = eventoService.getEventosByUserIdAndFecha(userId, fecha);
        return new ResponseEntity<>(eventos, HttpStatus.OK);
    }

    // 4. ACTUALIZAR un evento
    @PutMapping("/{eventoId}/user/{userId}")
    public ResponseEntity<Evento> updateEvento(
            @PathVariable Long eventoId,
            @PathVariable Long userId,
            @RequestBody Evento eventoDetails) {

        Evento eventoActualizado = eventoService.updateEvento(eventoId, userId, eventoDetails);
        return new ResponseEntity<>(eventoActualizado, HttpStatus.OK);
    }

    // 5. ELIMINAR un evento
    @DeleteMapping("/{eventoId}/user/{userId}")
    public ResponseEntity<String> deleteEvento(@PathVariable Long eventoId, @PathVariable Long userId) {
        eventoService.deleteEvento(eventoId, userId);
        return new ResponseEntity<>("Evento eliminado correctamente.", HttpStatus.OK);
    }
}