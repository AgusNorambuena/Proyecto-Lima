import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  Pressable, 
  ScrollView, 
  ImageBackground, 
  TextInput, 
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AppPopup, { useAppPopup } from './components/AppPopup';

interface Evento {
  id: number;
  titulo: string;
  fecha: string;
  completado: boolean;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function AgendaScreen() {
    const { width } = useWindowDimensions();
    const router = useRouter();
    const { userId, fecha } = useLocalSearchParams();
    const { popup, showPopup, dismissPopup } = useAppPopup();

    const [isDarkMode, setIsDarkMode] = useState(false);
    const [nuevoEvento, setNuevoEvento] = useState('');
    const [fechaSeleccionada, setFechaSeleccionada] = useState(
        typeof fecha === 'string' ? fecha : new Date().toISOString().split('T')[0]
    );
    const [listaEventos, setListaEventos] = useState<Evento[]>([]);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        obtenerEventosAPI();
    }, [userId]);

    const obtenerEventosAPI = async () => {
        if (!userId) return;
        try {
            setCargando(true);
            const response = await fetch(`${API_BASE_URL}/api/eventos/user/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setListaEventos(data);
            }
        } catch (error) {
            console.error("Error al obtener eventos:", error);
        } finally {
            setCargando(false);
        }
    };

    const guardarEventoAPI = async () => {
        if (!nuevoEvento.trim()) {
            showPopup({ title: 'Campo vacío', message: 'Por favor escribe el detalle de tu evento.', tone: 'info' });
            return;
        }

        const objetoEnviar = {
            titulo: nuevoEvento.trim(),
            fecha: fechaSeleccionada,
            completado: false
        };

        try {
            setCargando(true);
            const response = await fetch(`${API_BASE_URL}/api/eventos/user/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(objetoEnviar),
            });

            if (response.ok) {
                const eventoCreado = await response.json();
                setListaEventos((prev) => [eventoCreado, ...prev]);
                
                setNuevoEvento('');
                showPopup({ title: '¡Éxito! 📅', message: 'Evento guardado correctamente en tu agenda.', tone: 'success' });
            } else {
                showPopup({ title: 'Error', message: 'No se pudo guardar el evento en el servidor.', tone: 'error' });
            }
        } catch (error) {
            console.error("Error al guardar:", error);
            showPopup({ title: 'Error de conexión', message: 'No se pudo conectar con el servidor.', tone: 'error' });
        } finally {
            setCargando(false);
        }
    };

    const diasMesGrid = Array.from({ length: 15 }, (_, index) => index + 1);

    return (
        <View style={styles.wrapper}>
            <ImageBackground 
                source={require('../assets/images/FondoLima.png')} 
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
            />

            <StatusBar style={isDarkMode ? "light" : "dark"} />

            <SafeAreaView style={styles.body} edges={['top', 'left', 'right']}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    {/* Botón Modo Oscuro / Claro */}
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

                    {/* Título de la Sección */}
                    <View style={styles.tituloSeccionContainer}>
                        <Text style={styles.tituloSeccion}>AGENDA</Text>
                    </View>

                    {/* Contenedor Principal (Tarjeta del Mes) */}
                    <View style={styles.encuadreMes}>
                        <Text style={styles.mesTitulo}>
                            {fecha ? `EVENTOS (${fecha})` : 'MES'}
                        </Text>

                        {listaEventos.length > 0 ? (
                            <View style={{ width: '100%', marginBottom: 15 }}>
                                {listaEventos.slice(0, 4).map((ev) => (
                                    <View key={ev.id} style={styles.eventoItemCard}>
                                        <Text style={styles.eventoItemTexto} numberOfLines={1}>• {ev.titulo}</Text>
                                        <Text style={styles.eventoItemFecha}>{ev.fecha}</Text>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <View style={styles.gridContainer}>
                                {diasMesGrid.map((item) => (
                                    <View key={item} style={styles.gridCard} />
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Formulario para Añadir Evento */}
                    <View style={styles.inputSection}>
                        <Text style={styles.labelEvento}>AÑADIR EVENTO:</Text>
                        
                        <TextInput
                            style={[styles.inputEvento, { marginBottom: 10 }]}
                            placeholder="Fecha (YYYY-MM-DD)..."
                            placeholderTextColor="rgba(255, 255, 255, 0.7)"
                            value={fechaSeleccionada}
                            onChangeText={setFechaSeleccionada}
                        />

                        <TextInput
                            style={styles.inputEvento}
                            placeholder="Escribe un evento..."
                            placeholderTextColor="rgba(255, 255, 255, 0.7)"
                            value={nuevoEvento}
                            onChangeText={setNuevoEvento}
                        />

                        <Pressable style={styles.btnGuardarEvento} onPress={guardarEventoAPI}>
                            <Text style={styles.btnGuardarTexto}>Guardar Evento</Text>
                        </Pressable>
                    </View>

                </ScrollView>
            </SafeAreaView>
            <AppPopup popup={popup} onDismiss={dismissPopup} />
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
        color: '#8b00ff',
        letterSpacing: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.15)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    encuadreMes: {
        backgroundColor: 'rgba(50, 80, 180, 0.75)',
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
        fontSize: 22,
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
        backgroundColor: 'rgba(180, 240, 180, 0.85)',
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    eventoItemCard: {
        backgroundColor: 'rgba(180, 240, 180, 0.9)',
        padding: 10,
        borderRadius: 8,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    eventoItemTexto: {
        color: '#111',
        fontWeight: 'bold',
        fontSize: 14,
        flex: 1,
    },
    eventoItemFecha: {
        color: '#333',
        fontSize: 12,
        fontWeight: '600',
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
    btnGuardarEvento: {
        backgroundColor: '#4f46e5',
        marginTop: 10,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    btnGuardarTexto: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});