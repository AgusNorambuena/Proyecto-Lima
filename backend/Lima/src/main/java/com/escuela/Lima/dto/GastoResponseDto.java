package com.escuela.Lima.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GastoResponseDto {
    private Long id;
    private String nombre;
    private BigDecimal precio;
    private LocalDate fecha;
    private String categoria;
}