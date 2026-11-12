package com.escuela.Lima.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventoRequestDto {
    private String titulo;
    private LocalDate fecha; // YYYY-MM-DD compatible con react-native-calendars
    private LocalTime hora;
    private Boolean completado;
    private Long userId;
}