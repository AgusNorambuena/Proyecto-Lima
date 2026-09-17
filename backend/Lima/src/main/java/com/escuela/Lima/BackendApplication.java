package com.escuela.Lima;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        // Carga el archivo .env antes de arrancar Spring Boot
        Dotenv dotenv = Dotenv.configure().load();
        
        // Inyecta las variables del .env como propiedades del sistema
        dotenv.entries().forEach(entry -> 
            System.setProperty(entry.getKey(), entry.getValue())
        );

        SpringApplication.run(BackendApplication.class, args);
    }
}


