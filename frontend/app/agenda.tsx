import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  Pressable, 
  ScrollView, 
  ImageBackground, 
  TextInput, 
  useWindowDimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function AgendaScreen() {
    const { width } = useWindowDimensions();
    const router = useRouter();
    const { userId } = useLocalSearchParams();

    const [isDarkMode, setIsDarkMode] = useState(false);
    const [nuevoEvento, setNuevoEvento] = useState('');

    // Generamos 15 elementos simulando la cuadrícula del mes que aparece en la imagen
    const diasMesGrid = Array.from({ length: 15 }, (_, index) => index + 1);

    return (
        <View style={styles.wrapper}>
            {/* Fondo de pantalla general */}
            <ImageBackground 
                source={require('../assets/images/FondoLima.png')} 
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
            />

            <StatusBar style={isDarkMode ? "light" : "dark"} />

            <SafeAreaView style={styles.body} edges={['top', 'left', 'right']}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    {/* Botón de Modo Oscuro / Claro */}
                    <View style={styles.modosContainer}>
                        <Pressable 
                            style={styles.modosBtn} 
                            onPress={() => setIsDarkMode(!isDarkMode)}
                        >
                            <Ionicons 
                                name={isDarkMode ? "sunny" : "moon"} 
                                size={22} 
                                color="#fff" 
                            />
                        </Pressable>
                    </View>

                    {/* Logo de la aplicación */}
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../assets/images/LogoLima.png')}
                            style={[styles.logo, { width: width * 0.8 }]}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Título de la Sección: AGENDA */}
                    <View style={styles.tituloSeccionContainer}>
                        <Text style={styles.tituloSeccion}>AGENDA</Text>
                    </View>

                    {/* Contenedor Principal (Caja texturizada del Mes) */}
                    <View style={styles.encuadreMes}>
                        <Text style={styles.mesTitulo}>MES</Text>

                        {/* Cuadrícula de elementos del mes (3 columnas x 5 filas) */}
                        <View style={styles.gridContainer}>
                            {diasMesGrid.map((item) => (
                                <View key={item} style={styles.gridCard} />
                            ))}
                        </View>
                    </View>

                    {/* Etiqueta e Input para Añadir Evento */}
                    <View style={styles.inputSection}>
                        <Text style={styles.labelEvento}>AÑADIR EVENTO:</Text>
                        <TextInput
                            style={styles.inputEvento}
                            placeholder="Escribe un evento..."
                            placeholderTextColor="rgba(255, 255, 255, 0.7)"
                            value={nuevoEvento}
                            onChangeText={setNuevoEvento}
                        />
                    </View>

                </ScrollView>

                {/* Barra de Navegación Inferior Estilizada
                <View style={styles.bottomNav}>
                    <Pressable style={styles.navIconBtn} onPress={() => router.push({ pathname: '/inicio', params: { userId } })}>
                        <Ionicons name="person-outline" size={26} color="#fff" />
                    </Pressable>

                    <Pressable style={styles.navFabBtn} onPress={() => {}}>
                        <Ionicons name="add" size={32} color="#fff" />
                    </Pressable>

                    <Pressable style={styles.navIconBtn} onPress={() => {}}>
                        <Ionicons name="settings-outline" size={26} color="#fff" />
                    </Pressable>
                </View> */}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        position: 'relative',
    },
    body: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    scrollContent: {
        paddingBottom: 100,
        alignItems: 'center',
    },
    modosContainer: {
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 5,
        alignItems: 'flex-start',
    },
    modosBtn: {
        backgroundColor: '#0e249e',
        borderRadius: 25,
        height: 45,
        width: 45,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    logoContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 5,
    },
    logo: {
        height: 100,
    },
    tituloSeccionContainer: {
        marginBottom: 12,
    },
    tituloSeccion: {
        fontSize: 34,
        fontWeight: '900',
        color: '#8b00ff', // Tono morado característico de la imagen
        letterSpacing: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.15)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    encuadreMes: {
        backgroundColor: 'rgba(50, 80, 180, 0.75)', // Tono azulado translúcido de la tarjeta grande
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 15,
        width: '88%',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 5,
    },
    mesTitulo: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#8b00ff',
        marginBottom: 15,
        letterSpacing: 1.5,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
    },
    gridCard: {
        width: '30%',
        height: 42,
        backgroundColor: 'rgba(180, 240, 180, 0.85)', // Verde claro similar a las tarjetitas internas
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    inputSection: {
        width: '88%',
        marginTop: 15,
    },
    labelEvento: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#111',
        marginBottom: 6,
    },
    inputEvento: {
        backgroundColor: 'rgba(50, 80, 180, 0.75)',
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 12,
        color: '#fff',
        fontSize: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    bottomNav: {
        position: 'absolute',
        bottom: 15,
        alignSelf: 'center',
        width: '88%',
        height: 65,
        backgroundColor: '#22c1dc', // Turquesa brillante de la barra inferior
        borderRadius: 18,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    navIconBtn: {
        padding: 10,
    },
    navFabBtn: {
        backgroundColor: 'rgba(150, 230, 180, 0.9)',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
        marginBottom: 2,
    },
});