package com.escuela.Lima.repository;

import com.escuela.Lima.model.Gasto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GastoRepository extends JpaRepository<Gasto, Long> {
    List<Gasto> findByUserId(Long userId); // Busca todos los gastos asociados a ese usuario
}