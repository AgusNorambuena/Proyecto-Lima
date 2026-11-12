package com.escuela.Lima.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GastoRequestDto {
    private String nombre;
    private BigDecimal precio;
    private LocalDate fecha; // Formato estricto YYYY-MM-DD
    private String categoria;
    private Long userId;
}