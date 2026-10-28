package com.escuela.Lima.service;

import com.escuela.Lima.dto.GastoRequestDto;
import com.escuela.Lima.dto.GastoResponseDto;
import com.escuela.Lima.model.Gasto;
import com.escuela.Lima.model.User;
import com.escuela.Lima.repository.GastoRepository;
import com.escuela.Lima.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GastoService {

    @Autowired
    private GastoRepository gastoRepository;

    @Autowired
    private UserRepository userRepository;

    private GastoResponseDto mapToDto(Gasto g) {
        return new GastoResponseDto(
                g.getId(),
                g.getNombre(),
                g.getPrecio(),
                g.getFecha(),
                g.getCategoria()
        );
    }

    public List<GastoResponseDto> obtenerGastosPorUsuario(Long userId) {
        return gastoRepository.findByUserId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public GastoResponseDto guardarGasto(GastoRequestDto dto) {
        if (dto.getUserId() == null) {
            throw new RuntimeException("El gasto debe estar asociado a un usuario válido.");
        }

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + dto.getUserId()));

        Gasto gasto = new Gasto();
        gasto.setNombre(dto.getNombre());
        gasto.setPrecio(dto.getPrecio());
        gasto.setFecha(dto.getFecha());
        gasto.setCategoria(dto.getCategoria());
        gasto.setUser(user);

        Gasto saved = gastoRepository.save(gasto);
        return mapToDto(saved);
    }
}