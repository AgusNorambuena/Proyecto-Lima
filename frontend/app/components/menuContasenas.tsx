import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MenuContraseñas() {
  const [isOpen, setIsOpen] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas las contraseñas');

  // Valor animado que irá de 0 (cerrado) a 1 (abierto)
  const animationController = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;

    // Ejecutamos la animación de forma fluida
    Animated.timing(animationController, {
      toValue,
      duration: 250, // Duración en milisegundos
      useNativeDriver: false, // Debe estar en false porque animamos la altura/opacidad
    }).start();

    setIsOpen(!isOpen);
  };

  const seleccionarOpcion = (opcion: string) => {
    setCategoriaSeleccionada(opcion);
    
    // Cierra el menú al seleccionar una opción
    Animated.timing(animationController, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    setIsOpen(false);
  };

  // Interpolación para transformar el valor (0 a 1) en opacidad y desplazamiento
  const arrowAngle = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'], // Opcional: si prefieres rotar la flecha en lugar de cambiarla
  });

  const animatedStyle = {
    opacity: animationController,
    transform: [
      {
        translateY: animationController.interpolate({
          inputRange: [0, 1],
          outputRange: [-10, 0], // Pequeño efecto de deslizamiento vertical
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      {/* Botón principal del menú (Cabecera) */}
      <Pressable style={styles.header} onPress={toggleMenu}>
        <Ionicons name="folder-outline" size={20} color="#4f46e5" style={styles.folderIcon} />
        <Text style={styles.headerText}>{categoriaSeleccionada}</Text>
        
        {/* El icono cambia dinámicamente según la variable `isOpen` */}
        <Ionicons 
          name={isOpen ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#666" 
        />
      </Pressable>

      {/* Contenido desplegable animado */}
      {isOpen && (
        <Animated.View style={[styles.dropdown, animatedStyle]}>
          <Pressable 
            style={styles.option} 
            onPress={() => seleccionarOpcion('Todas las contraseñas')}
          >
            <Text style={styles.optionText}>📁 Todas las contraseñas</Text>
          </Pressable>

          <Pressable 
            style={styles.option} 
            onPress={() => seleccionarOpcion('Contraseñas Personales')}
          >
            <Text style={styles.optionText}>🔑 Contraseñas Personales</Text>
          </Pressable>

          <Pressable 
            style={styles.option} 
            onPress={() => seleccionarOpcion('Trabajo y Servidores')}
          >
            <Text style={styles.optionText}>💼 Trabajo y Servidores</Text>
          </Pressable>

          <Pressable 
            style={styles.option} 
            onPress={() => seleccionarOpcion('Redes Sociales')}
          >
            <Text style={styles.optionText}>🌐 Redes Sociales</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  folderIcon: {
    marginRight: 10,
  },
  headerText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  dropdown: {
    marginTop: 5,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    elevation: 2, // Sombra para Android
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  optionText: {
    fontSize: 15,
    color: '#4b5563',
  },
});