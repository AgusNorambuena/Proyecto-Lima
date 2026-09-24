package com.escuela.Lima.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "passwords")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Password {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String titulo;

    @Column(nullable = false, length = 150)
    private String usuarioCuenta;

    @Column(name = "password", nullable = false, length = 500)
    private String password;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 100)
    private String categoria;

    @Column(length = 255)
    private String url;

    @Column(length = 500)
    private String notas;

    // Dueño de la contraseña. Opcional por ahora (nullable),
    // así se pueden crear y borrar contraseñas sin usuario.
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    @PrePersist
    protected void alCrear() {
        this.fechaCreacion = LocalDateTime.now();
        this.fechaActualizacion = this.fechaCreacion;
    }

    @PreUpdate
    protected void alActualizar() {
        this.fechaActualizacion = LocalDateTime.now();
    }
}