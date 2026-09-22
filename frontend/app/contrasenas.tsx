import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import MenuContraseñas from './components/menuContasenas';

export default function Contraseñas() {
    const [texto, setTexto] = useState('');

    return (
        <>
            <SafeAreaView >
                <ScrollView style={styles.container}>
                    <View style={{ padding: 20 }}>
                        <Text style={styles.titulo}>
                            Contraseñas
                        </Text>
                        <Text style={styles.textoNormal}>
                            Aqui puedes guardar tus contraseñas de forma segura y acceder a ellas cuando lo necesites. Asegúrate de mantener tu información protegida y no compartir tus contraseñas con nadie.
                        </Text>
                    </View>
                    <View >
                        <View style={styles.searchContainer}>
                            <Ionicons name="search" size={20} color="black" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Buscar Contraseña..."
                                placeholderTextColor="#888"
                                value={texto}
                                onChangeText={setTexto}
                            />
                        </View>
                    </View>
                    <View style={{ padding: 20 }}>
                        <Text style={styles.titulo}>
                            Funcionalidades
                        </Text>
                        <Text style={styles.textoNormal}>
                            - Crear y gestionar contraseñas
                            - Generar contraseñas seguras
                            - Buscar y filtrar contraseñas
                        </Text>
                    </View>
                    <MenuContraseñas/>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}   

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titulo: {
    fontSize: 40, // Tamaño grande para títulos
    fontWeight: 'bold',
  },
  textoNormal: {
    fontSize: 16, // Tamaño estándar recomendado para párrafos
  },
  buscador:{
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    margin: 10,
  },
  searchContainer: {
    flexDirection: 'row', // Pone el icono y el input en la misma línea (horizontal)
    alignItems: 'center', // Centra los elementos verticalmente
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    height: 45,
  },
  icon: {
    marginRight: 8, // Espacio entre el icono y el texto
  },
  input: {
    flex: 1, // Hace que el input ocupe todo el espacio restante
    fontSize: 16,
    color: '#000',
    // Ya no necesitas border ni height aquí, los maneja el contenedor padre
  },
});