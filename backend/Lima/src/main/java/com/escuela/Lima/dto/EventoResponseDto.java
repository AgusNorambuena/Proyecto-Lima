package com.escuela.Lima.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventoResponseDto {
    private Long id;
    private String titulo;
    private LocalDate fecha;
    private LocalTime hora;
    private Boolean completado;
    private LocalDateTime fechaCreacion;
}