package com.escuela.Lima.controller;

import com.escuela.Lima.dto.GastoRequestDto;
import com.escuela.Lima.dto.GastoResponseDto;
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
    public ResponseEntity<List<GastoResponseDto>> obtenerGastosPorUsuario(@PathVariable Long userId) {
        List<GastoResponseDto> dtos = gastoService.obtenerGastosPorUsuario(userId);
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<GastoResponseDto> crearGasto(@RequestBody GastoRequestDto requestDto) {
        GastoResponseDto nuevoGasto = gastoService.guardarGasto(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoGasto);
    }
}