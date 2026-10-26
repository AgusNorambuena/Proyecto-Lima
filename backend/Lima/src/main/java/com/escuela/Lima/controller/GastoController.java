package com.escuela.Lima.controller;

import com.escuela.Lima.model.Gasto;
import com.escuela.Lima.service.GastoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gastos")
@CrossOrigin(origins = "*")
public class GastoController {

    @Autowired
    private GastoService gastoService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Gasto>> obtenerGastosPorUsuario(@PathVariable Long userId) {
        List<Gasto> gastos = gastoService.obtenerGastosPorUsuario(userId);
        return ResponseEntity.ok(gastos);
    }

    @PostMapping
    public ResponseEntity<?> crearGasto(@RequestBody Gasto gasto) {
        try {
            Gasto nuevoGasto = gastoService.guardarGasto(gasto);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoGasto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}