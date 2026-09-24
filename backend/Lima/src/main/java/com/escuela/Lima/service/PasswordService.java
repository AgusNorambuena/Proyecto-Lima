package com.escuela.Lima.service;

import com.escuela.Lima.model.Password;
import com.escuela.Lima.repository.PasswordRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PasswordService {

    private final PasswordRepository passwordItemRepository;

    public PasswordService(PasswordRepository passwordItemRepository) {
        this.passwordItemRepository = passwordItemRepository;
    }

    public List<Password> getPasswordsByUser(Long userId) {
        return passwordItemRepository.findByUserId(userId);
    }

    public Password savePassword(Password passwordItem) {
        // Acá va el cifrado AES de passwordItem.getContrasenia() antes de guardar
        return passwordItemRepository.save(passwordItem);
    }

    public void deletePassword(Long id) {
        passwordItemRepository.deleteById(id);
    }
}