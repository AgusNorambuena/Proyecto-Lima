package com.escuela.Lima.service;

import com.escuela.Lima.model.Gasto;
import com.escuela.Lima.model.User;
import com.escuela.Lima.repository.GastoRepository;
import com.escuela.Lima.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GastoService {

    @Autowired
    private GastoRepository gastoRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Gasto> obtenerGastosPorUsuario(Long userId) {
        return gastoRepository.findByUserId(userId);
    }

    public Gasto guardarGasto(Gasto gasto) {
        if (gasto.getUser() == null || gasto.getUser().getId() == null) {
            throw new RuntimeException("El gasto debe estar asociado a un usuario válido.");
        }

        // Buscar el usuario existente en la base de datos
        User user = userRepository.findById(gasto.getUser().getId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + gasto.getUser().getId()));

        gasto.setUser(user);
        return gastoRepository.save(gasto);
    }
}