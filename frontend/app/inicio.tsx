import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, Pressable, useWindowDimensions, ScrollView, ImageBackground, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, Link, useLocalSearchParams } from 'expo-router';
import { Calendar, LocaleConfig } from 'react-native-calendars';

// Configuración opcional en español para el calendario
LocaleConfig.locales['es'] = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

interface Credencial {
    id: number;
    nombre: string;
    usuarioCuenta: string;
    password: string;
    categoria: string;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Inicio() {
    const { width } = useWindowDimensions();
    const router = useRouter();

    const { userId } = useLocalSearchParams();

    const [ultimasContraseñas, setUltimasContraseñas] = useState<Credencial[]>([]);
    const [visibles, setVisibles] = useState<{ [key: number]: boolean }>({});
    const [selectedDate, setSelectedDate] = useState('');

    const [isDarkMode, setIsDarkMode] = useState(false);

    const styles = Styles(width, isDarkMode);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: isDarkMode ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isDarkMode]);

    useEffect(() => {
        const obtenerUltimasContraseñas = async () => {
            if (!userId) return;
            try {
                const response = await fetch(`${API_BASE_URL}/api/passwords/user/${userId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (response.ok) {
                    const data: Credencial[] = await response.json();
                    const ordenadas = data.sort((a, b) => b.id - a.id).slice(0, 3);
                    setUltimasContraseñas(ordenadas);
                }
            } catch (error) {
                console.error("Error al cargar contraseñas en inicio:", error);
            }
        };

        obtenerUltimasContraseñas();
    }, [userId]);

    const toggleVisibilidad = (id: number) => {
        setVisibles((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <View style={styles.Wrapper}>
            <ImageBackground 
                source={require('../assets/images/FondoLima.png')} 
                style={[StyleSheet.absoluteFill, { flex: 1 }]}
                resizeMode="cover"
            />

            <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
                <ImageBackground 
                    source={require('../assets/images/FondoLimaOscuro.png')} 
                    style={{ flex: 1 }}
                    resizeMode="cover"
                />
            </Animated.View>

            <StatusBar style={isDarkMode ? "light" : "dark"} />

            <SafeAreaView style={styles.Body} edges={['top', 'left', 'right']}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
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
                        <Link 
                            href={{
                                pathname: "/contrasenas",
                                params: { userId: userId }
                            }} 
                            push 
                            asChild
                        >
                            <Pressable style={styles.Gestor}>
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
                                {ultimasContraseñas.length === 0 ? (
                                    <View style={styles.cardVacia}>
                                        <Text style={styles.textoVacio}>Sin registros recientes</Text>
                                    </View>
                                ) : (
                                    ultimasContraseñas.map((item) => {
                                        const esVisible = visibles[item.id];
                                        return (
                                            <Pressable 
                                                key={item.id} 
                                                style={styles.card}
                                                onPress={() => router.push({
                                                    pathname: "/contrasenas",
                                                    params: { userId: userId }
                                                })}
                                            >
                                                <View style={styles.cardHeader}>
                                                    <View style={{ flex: 1, marginRight: 6 }}>
                                                        <Text style={styles.nombreTexto} numberOfLines={1}>
                                                            {item.nombre}
                                                        </Text>
                                                        <Text style={styles.usuarioTexto} numberOfLines={1}>
                                                            {item.usuarioCuenta}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.badgeCategoria}>
                                                        <Text style={styles.badgeTexto} numberOfLines={1}>
                                                            {item.categoria}
                                                        </Text>
                                                    </View>
                                                </View>

                                                <View style={styles.claveContainer}>
                                                    <Text style={styles.claveTexto}>
                                                        {esVisible ? item.password : '••••••••••••'}
                                                    </Text>
                                                    <Pressable 
                                                        onPress={(e) => {
                                                            e.stopPropagation();
                                                            toggleVisibilidad(item.id);
                                                        }} 
                                                        style={styles.ojoBtn}
                                                    >
                                                        <Ionicons 
                                                            name={esVisible ? "eye-off-outline" : "eye-outline"} 
                                                            size={16} 
                                                            color={isDarkMode ? "#9ca3af" : "#4b5563"} 
                                                        />
                                                    </Pressable>
                                                </View>
                                            </Pressable>
                                        );
                                    })
                                )}
                            </ScrollView>
                        </View>

                        {/* SECCIÓN AGENDA */}
                        <Pressable 
                            style={styles.Gestor} 
                            onPress={() => router.push({
                                pathname: '../agenda',
                                params: { userId: userId }
                            })}
                        >
                            <Text style={styles.gestorTexto}>Agenda</Text>
                        </Pressable>

                        {/* CONTENEDOR DEL CALENDARIO INTEGRADO */}
                        <View style={styles.ContenidoCalendario}>
                            <Calendar
                                onDayPress={(day) => {
                                    setSelectedDate(day.dateString);
                                    router.push({
                                        pathname: '../agenda',
                                        params: { userId: userId, fecha: day.dateString }
                                    });
                                }}
                                markedDates={{
                                    [selectedDate]: { selected: true, selectedColor: '#4f46e5' }
                                }}
                                theme={{
                                    backgroundColor: 'transparent',
                                    calendarBackground: 'transparent',
                                    textSectionTitleColor: isDarkMode ? '#a1a1aa' : '#374151',
                                    selectedDayBackgroundColor: '#4f46e5',
                                    selectedDayTextColor: '#ffffff',
                                    todayTextColor: 'hsl(83, 69%, 48%)',
                                    dayTextColor: isDarkMode ? '#ffffff' : '#111827',
                                    textDisabledColor: isDarkMode ? '#4b5563' : '#d1d5db',
                                    arrowColor: isDarkMode ? 'hsl(83, 69%, 48%)' : '#4f46e5',
                                    monthTextColor: isDarkMode ? '#ffffff' : '#111827',
                                    indicatorColor: '#4f46e5',
                                    textDayFontWeight: '500',
                                    textMonthFontWeight: 'bold',
                                    textDayHeaderFontWeight: '600',
                                    textDayFontSize: 13,
                                    textMonthFontSize: 15,
                                    textDayHeaderFontSize: 11,
                                }}
                            />
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
        position: 'relative',
    },
    scrollContent: {
        paddingBottom: 110,
    },
    ModosContainer: {
        paddingHorizontal: 20,
        marginTop: 10,
        zIndex: 10,
    },
    Modos: {
        backgroundColor: isDarkMode ? "hsl(83, 69%, 48%)" : '#0e249e',
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
        height: 135,
        width: width * 0.9,
        alignSelf: "center",
        justifyContent: 'center',
    },
    // Estilo adaptado especialmente para el contenedor del Calendario
    ContenidoCalendario: {
        backgroundColor: isDarkMode ? '#1e1e1e' : 'rgba(255, 255, 255, 0.85)',
        borderRadius: 12,
        padding: 8,
        marginBottom: 15,
        width: width * 0.9,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    scrollView: {
        width: '100%',
    },
    contenedorScroll: {
        paddingHorizontal: 5,
        alignItems: 'center',
    },
    card: {
        width: width * 0.65,
        backgroundColor: isDarkMode ? '#ffffff' : '#4f46e5',
        borderRadius: 10,
        padding: 10,
        marginRight: 12,
        justifyContent: 'space-between',
        elevation: 3,
    },
    cardVacia: {
        width: width * 0.75,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textoVacio: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    nombreTexto: {
        fontSize: 15,
        fontWeight: 'bold',
        color: isDarkMode ? '#111827' : '#ffffff',
    },
    usuarioTexto: {
        fontSize: 12,
        color: isDarkMode ? '#6b7280' : '#a1a1aa',
    },
    badgeCategoria: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        backgroundColor: isDarkMode ? '#f3f4f6' : '#333333',
    },
    badgeTexto: {
        fontSize: 9,
        fontWeight: '500',
        color: isDarkMode ? '#4b5563' : '#d1d5db',
    },
    claveContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderWidth: 1,
        backgroundColor: isDarkMode ? '#f9fafb' : '#2a2a2a',
        borderColor: isDarkMode ? '#ccc' : '#333',
    },
    claveTexto: {
        fontSize: 13,
        fontFamily: 'monospace',
        color: isDarkMode ? '#374151' : '#f3f4f6',
    },
    ojoBtn: {
        padding: 2,
    },
    cardGenerica: {
        width: width * 0.4,
        height: width * 0.2,
        backgroundColor: '#4f46e5',
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    textoGenerico: { 
        color: '#fff', 
        fontWeight: 'bold' 
    },
});