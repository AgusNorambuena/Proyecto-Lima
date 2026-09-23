import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import MenuContraseñas from './components/menuContasenas';

export default function Contraseñas() {
    const [texto, setTexto] = useState('');

    return (
        <>
            {/* 1. Agregado style={styles.safeArea} para fijar la pantalla */}
            <SafeAreaView style={styles.safeArea}>
                <ScrollView 
                    style={styles.container} 
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    automaticallyAdjustKeyboardInsets={false}
                >
                    <View style={{ padding: 20 }}>
                        <Text style={styles.titulo}>
                            Contraseñas
                        </Text>
                        <Text style={styles.textoNormal}>
                            Aqui puedes guardar tus contraseñas de forma segura y acceder a ellas cuando lo necesites. Asegúrate de mantener tu información protegida y no compartir tus contraseñas con nadie.
                        </Text>
                    </View>
                    <View style={{ padding: 20 }}>
                        <Text style={styles.titulofuncional}>
                            Funcionalidades
                        </Text>
                        <Text style={styles.textoNormal}>
                            - Crear y gestionar contraseñas{"\n"}
                            - Generar contraseñas seguras{"\n"}
                            - Buscar y filtrar contraseñas
                        </Text>
                    </View>
                    <View>
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
                    
                    {/* 2. Se envía la prop textoBusqueda a MenuContraseñas */}
                    <MenuContraseñas textoBusqueda={texto} />
                </ScrollView>
            </SafeAreaView>
        </>
    );
}   

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
  },
  titulo: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  titulofuncional: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  textoNormal: {
    fontSize: 18,
  },
  buscador:{
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    margin: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    height: 45,
    marginHorizontal: 20, // Agregado para alinearlo con los paddings
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
});