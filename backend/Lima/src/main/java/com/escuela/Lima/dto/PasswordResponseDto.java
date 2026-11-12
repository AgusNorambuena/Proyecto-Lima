package com.escuela.Lima.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PasswordResponseDto {
    private Long id;
    private String nombre;
    private String usuarioCuenta;
    private String password;
    private String categoria;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
}