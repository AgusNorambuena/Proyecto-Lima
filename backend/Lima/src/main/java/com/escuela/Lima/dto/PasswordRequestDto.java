package com.escuela.Lima.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PasswordRequestDto {
    private String nombre;
    private String usuarioCuenta;
    private String password;
    private String categoria;
    private Long userId; // Vincula la credencial al usuario
}