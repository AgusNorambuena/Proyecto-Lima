import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  textoBusqueda?: string;
  onSeleccionarCategoria?: (categoria: string) => void; 
}

export default function MenuContraseñas({ textoBusqueda = '' }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas las contraseñas');

  const animationController = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;

    Animated.timing(animationController, {
      toValue,
      duration: 250,
      useNativeDriver: false,
    }).start();

    setIsOpen(!isOpen);
  };

  const seleccionarOpcion = (opcion: string) => {
    setCategoriaSeleccionada(opcion);
    
    Animated.timing(animationController, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    setIsOpen(false);
  };

  const animatedStyle = {
    opacity: animationController,
    transform: [
      {
        translateY: animationController.interpolate({
          inputRange: [0, 1],
          outputRange: [-10, 0],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      {/* Botón principal del menú */}
      <Pressable onPress={toggleMenu} style={styles.header}>
        <Ionicons name="folder-outline" size={20} color="#4f46e5" style={styles.folderIcon} />
        <Text style={styles.headerText}>{categoriaSeleccionada}</Text>
        
        <Ionicons 
          name={isOpen ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#666" 
        />
      </Pressable>

      {/* Contenido desplegable animado */}
      <Animated.View 
        pointerEvents={isOpen ? 'auto' : 'none'} 
        style={[styles.dropdown, animatedStyle]}
      >
        <Pressable 
          style={styles.option} 
          onPress={() => seleccionarOpcion('Todas las contraseñas')}
        >
          <Ionicons name="file-tray-full-outline" size={18} color="#4b5563" style={styles.optionIcon} />
          <Text style={styles.optionText}>Todas las contraseñas</Text>
        </Pressable>

        <Pressable 
          style={styles.option} 
          onPress={() => seleccionarOpcion('Contraseñas Personales')}
        >
          <Ionicons name="key-outline" size={18} color="#4b5563" style={styles.optionIcon} />
          <Text style={styles.optionText}>Contraseñas Personales</Text>
        </Pressable>

        <Pressable 
          style={styles.option} 
          onPress={() => seleccionarOpcion('Trabajo y Servidores')}
        >
          <Ionicons name="briefcase-outline" size={18} color="#4b5563" style={styles.optionIcon} />
          <Text style={styles.optionText}>Trabajo y Servidores</Text>
        </Pressable>

        <Pressable 
          style={styles.option} 
          onPress={() => seleccionarOpcion('Redes Sociales')}
        >
          <Ionicons name="globe-outline" size={18} color="#4b5563" style={styles.optionIcon} />
          <Text style={styles.optionText}>Redes Sociales</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
    zIndex: 1000, 
    position: 'relative',
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
    position: 'absolute',
    top: 55,
    left: 20,
    right: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  option: {
    flexDirection: 'row',       
    alignItems: 'center',       
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  optionIcon: {
    marginRight: 10,            
  },
  optionText: {
    fontSize: 15,
    color: '#4b5563',
  },
});