package com.escuela.Lima.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "passwords")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Password {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Spring Boot la convierte en columna 'id' (Primary Key automáticamente)

    @Column(nullable = false)
    private String nombre; // Ejemplo: "Gmail Personal"

    @Column(name = "username_or_email")
    private String username; // El usuario de esa cuenta

    @Column(nullable = false, name = "password")
    private String contraseña; // La contraseña cifrada (Obligatoria)

    private String url; // Opcional, se convierte en columna 'url' automáticamente

    @Column(columnDefinition = "TEXT")
    private String notes; // Opcional, le decimos que sea de tipo TEXT por si la nota es larga

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Relación con el usuario

    // Getters y Setters...
}