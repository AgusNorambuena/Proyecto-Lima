package com.escuela.Lima.controller;

import com.escuela.Lima.model.Password;
import com.escuela.Lima.repository.PasswordRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/Passwords")
@CrossOrigin(origins = "*")
public class PasswordController {

    private final PasswordRepository repository;

    public PasswordController(PasswordRepository repository) {
        this.repository = repository;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<Password> crear(@RequestBody Password password) {
        password.setId(null);
        Password guardada = repository.save(password);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
    }

    // READ - todas
    @GetMapping
    public List<Password> listar() {
        return repository.findAll();
    }

    // READ - una
    @GetMapping("/{id}")
    public ResponseEntity<Password> obtener(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Password> actualizar(@PathVariable Long id,
                                               @RequestBody Password datos) {
        return repository.findById(id)
                .map(existente -> {
                    existente.setTitulo(datos.getTitulo());
                    existente.setUsuarioCuenta(datos.getUsuarioCuenta());
                    existente.setContrasenia(datos.getContrasenia());
                    existente.setCategoria(datos.getCategoria());
                    existente.setUrl(datos.getUrl());
                    existente.setNotas(datos.getNotas());
                    return ResponseEntity.ok(repository.save(existente));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}