import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, Pressable, useWindowDimensions, ScrollView, ImageBackground, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, Link } from 'expo-router';

export default function Inicio() {
    const { width } = useWindowDimensions();

    const router = useRouter();
    
    // Estado para controlar si está en modo oscuro (true) o claro (false)
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Generamos los estilos pasando el ancho y el estado del modo oscuro
    const styles = Styles(width, isDarkMode);

    // Opacidad modo oscuro
    const fadeAnim = useRef(new Animated.Value(0)).current;
 
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: isDarkMode ? 1 : 0,
            duration: 300, // Duración en milisegundos de la transición
            useNativeDriver: true, // Optimización de rendimiento
        }).start();
    }, [isDarkMode]);
    
    return (
        <View style={styles.Wrapper}>
    {/* Fondo Claro (Fijo en la base) */}
    <ImageBackground 
        source={require('../assets/images/FondoLima.png')} 
        style={[StyleSheet.absoluteFill, { flex: 1 }]}
        resizeMode="cover"
    />

    {/* Fondo Oscuro (Animado encima) */}
    <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
        <ImageBackground 
            source={require('../assets/images/FondoLimaOscuro.png')} 
            style={{ flex: 1 }}
            resizeMode="cover"
        />
    </Animated.View>
            {/* Cambiamos el estilo de la barra de estado según el modo */}
            <StatusBar style={isDarkMode ? "light" : "dark"} />
            
            <SafeAreaView style={styles.Body} edges={['top', 'left', 'right']}>
                {/* El ScrollView solo maneja el contenido que se desliza */}
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Caja de Modos con el icono vectorial integrado */}
                    <View style={styles.ModosContainer}>
                        <Pressable 
                            style={styles.Modos} 
                            onPress={() => setIsDarkMode(!isDarkMode)}
                        >
                            <Ionicons 
                                name={isDarkMode ? "sunny" : "moon"} 
                                size={24} 
                                color="#fff" 
                            />
                        </Pressable>
                    </View>

                    <View style={styles.LogoContainer}>
                        <Image
                            source={require('../assets/images/LogoLima.png')}
                            style={styles.Logo}
                            resizeMode="contain"
                        />
                    </View>
                    
                    <View style={styles.Seccion}>
                        <Link href="/contrasenas" push asChild>
                        <Pressable style={styles.Gestor}
                        >
                            <Text style={styles.gestorTexto}>Contraseñas</Text>
                        </Pressable>
                        </Link>

                        <View style={styles.Contenido}>
                            <ScrollView
                                horizontal={true}
                                style={styles.scrollView}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.contenedorScroll}
                            >
                                <View style={styles.card}><Text style={styles.texto}>Elemento 1</Text></View>
                                <View style={styles.card}><Text style={styles.texto}>Elemento 2</Text></View>
                                <View style={styles.card}><Text style={styles.texto}>Elemento 3</Text></View>
                                <View style={styles.card}><Text style={styles.texto}>Elemento 4</Text></View>
                            </ScrollView>
                        </View>

                        <Pressable style={styles.Gestor}>
                            <Text style={styles.gestorTexto}>Contraseñas</Text>
                        </Pressable>

                        <View style={styles.Contenido}>
                            <ScrollView
                                horizontal
                                style={styles.scrollView}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.contenedorScroll}
                            >
                                <View style={styles.card}><Text style={styles.texto}>Elemento 1</Text></View>
                                <View style={styles.card}><Text style={styles.texto}>Elemento 2</Text></View>
                                <View style={styles.card}><Text style={styles.texto}>Elemento 3</Text></View>
                                <View style={styles.card}><Text style={styles.texto}>Elemento 4</Text></View>
                            </ScrollView>
                        </View>

                        <Pressable style={styles.Gestor}>
                            <Text style={styles.gestorTexto}>Contraseñas</Text>
                        </Pressable>

                        <View style={styles.Contenido}>
                            <ScrollView
                                horizontal={true}
                                style={styles.scrollView}
                                showsHorizontalScrollIndicator={true}
                                contentContainerStyle={styles.contenedorScroll}
                            >
                                <View style={styles.card}><Text style={styles.texto}>Elemento 1</Text></View>
                                <View style={styles.card}><Text style={styles.texto}>Elemento 2</Text></View>
                                <View style={styles.card}><Text style={styles.texto}>Elemento 3</Text></View>
                                <View style={styles.card}><Text style={styles.texto}>Elemento 4</Text></View>
                            </ScrollView>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const Styles = (width: number, isDarkMode: boolean) => StyleSheet.create({
    Wrapper: {
        flex: 1,
        position: 'relative',
    },
    Body: {
        flex: 1,
        backgroundColor: 'transparent',
        position: 'relative', // Vital para que la barra absoluta se ancle a este contenedor y no a toda la pantalla por detrás del notch
    },
    scrollContent: {
        paddingBottom: 110, // Espacio para que el último elemento haga scroll por encima de la barra flotante
    },
    ModosContainer: {
        paddingHorizontal: 20,
        marginTop: 10,
        zIndex: 10,
    },
    Modos: {
        backgroundColor: isDarkMode ? '#f1c40f' : '#0e249e',
        borderRadius: 25,
        height: 50,
        width: 50,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    // Estilos de la barra flotante fija inferior por encima de todo
    barraFlotanteContainer: {
        position: 'absolute',
        bottom: 15,
        left: 20,
        right: 20,
        height: 70,
        backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderRadius: 35,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
        zIndex: 999, // Prioridad máxima para que flote permanentemente
    },
    botonSecundario: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#00b4d8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    botonPrincipal: {
        width: 65,
        height: 65,
        borderRadius: 32.5,
        backgroundColor: '#52b788',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12, // Efecto estético de elevación para el botón central (+)
        borderWidth: 3,
        borderColor: isDarkMode ? '#121212' : '#fff',
    },
    LogoContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 10,
    },
    Logo: {
        width: width,
        height: 160,
    },
    Seccion: {
        marginBottom: 10,
    },
    Gestor: {
        backgroundColor: "hsl(83, 69%, 48%)",
        borderRadius: 10,
        padding: 10,
        marginLeft: width * 0.1,
        width: width * 0.3,
        marginBottom: 10,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    gestorTexto: {
        fontSize: 15,
        fontWeight: "bold",
        color: '#000',
    },
    Contenido: {
        backgroundColor: isDarkMode ? '#1e1e1e' : '#72727265',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        height: width * 0.3,
        width: width * 0.8,
        alignSelf: "center",
        alignItems: "flex-start",
    },
    scrollView: {
        width: '100%',
    },
    contenedorScroll: {
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    card: {
        width: width * 0.4,
        height: width * 0.2,
        backgroundColor: '#4f46e5',
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    texto: { 
        color: '#fff', 
        fontWeight: 'bold' 
    },
});