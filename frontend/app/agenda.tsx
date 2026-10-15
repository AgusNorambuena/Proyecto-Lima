import React, { useState, useEffect, useCallback } from 'react';
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
    Modal,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import AppPopup, { useAppPopup } from './components/AppPopup';
import ThemeToggle from '../theme/ThemeToggle';
import { useTheme } from '../theme/ThemeProvider';

interface Evento {
  id: number;
  titulo: string;
  fecha: string;
    hora?: string | null;
  completado: boolean;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

function obtenerFechaLocal() {
        const hoy = new Date();
        const mes = String(hoy.getMonth() + 1).padStart(2, '0');
        const dia = String(hoy.getDate()).padStart(2, '0');
        return `${hoy.getFullYear()}-${mes}-${dia}`;
}

export default function AgendaScreen() {
    const { width } = useWindowDimensions();
    const { userId, fecha } = useLocalSearchParams();
    const { popup, showPopup, dismissPopup } = useAppPopup();

    const { isDarkMode } = useTheme();
    const colors = isDarkMode
        ? { text: '#f8fafc', muted: '#cbd5e1', surface: '#17212b', input: '#1f2937', border: '#475569', accent: '#a8d52a' }
        : { text: '#17211a', muted: '#475569', surface: 'rgba(255, 255, 255, 0.94)', input: '#f2f6eb', border: '#d8e2cb', accent: '#477b18' };
    const [nuevoEvento, setNuevoEvento] = useState('');
    const [horaSeleccionada, setHoraSeleccionada] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(
        typeof fecha === 'string' ? fecha : obtenerFechaLocal()
    );
    const [listaEventos, setListaEventos] = useState<Evento[]>([]);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [eliminandoId, setEliminandoId] = useState<number | null>(null);
    const [errorCarga, setErrorCarga] = useState(false);

    const solicitarEventos = useCallback(async () => {
        if (!userId) return [] as Evento[];
        const response = await fetch(`${API_BASE_URL}/api/eventos/user/${userId}`);
        if (!response.ok) throw new Error('No se pudieron cargar los eventos.');
        return await response.json() as Evento[];
    }, [userId]);

    useEffect(() => {
        let activo = true;
        solicitarEventos()
            .then((eventos) => {
                if (activo) {
                    setListaEventos(eventos);
                    setErrorCarga(false);
                }
            })
            .catch((error: unknown) => {
                console.error('Error al obtener eventos:', error);
                if (activo) setErrorCarga(true);
            })
            .finally(() => {
                if (activo) setCargando(false);
            });
        return () => { activo = false; };
    }, [solicitarEventos]);

    const reintentarCarga = async () => {
        try {
            const eventos = await solicitarEventos();
            setListaEventos(eventos);
            setErrorCarga(false);
        } catch (error) {
            console.error('Error al obtener eventos:', error);
            setErrorCarga(true);
        } finally {
            setCargando(false);
        }
    };

    const eliminarEventoAPI = async (evento: Evento) => {
        if (eliminandoId !== null) return;
        setEliminandoId(evento.id);
        try {
            const response = await fetch(`${API_BASE_URL}/api/eventos/${evento.id}/user/${userId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('No se pudo eliminar el evento.');
            setListaEventos((eventos) => eventos.filter((item) => item.id !== evento.id));
        } catch (error) {
            console.error('Error al eliminar evento:', error);
            showPopup({ title: 'No se pudo eliminar', message: 'Inténtalo de nuevo en unos momentos.', tone: 'error' });
        } finally {
            setEliminandoId(null);
        }
    };

    const confirmarEliminacion = (evento: Evento) => {
        showPopup({
            title: 'Eliminar evento',
            message: `¿Quieres eliminar “${evento.titulo}”? Esta acción no se puede deshacer.`,
            tone: 'confirm',
            actions: [
                { label: 'Cancelar', variant: 'secondary' },
                { label: 'Eliminar', variant: 'danger', onPress: () => eliminarEventoAPI(evento) },
            ],
        });
    };

    const guardarEventoAPI = async () => {
        if (guardando) return;
        if (!nuevoEvento.trim()) {
            showPopup({ title: 'Campo vacío', message: 'Por favor escribe el detalle de tu evento.', tone: 'info' });
            return;
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaSeleccionada)) {
            showPopup({ title: 'Fecha inválida', message: 'Usa el formato AAAA-MM-DD.', tone: 'info' });
            return;
        }

        if (horaSeleccionada && !/^([01]\d|2[0-3]):[0-5]\d$/.test(horaSeleccionada)) {
            showPopup({ title: 'Hora inválida', message: 'Usa el formato de 24 horas, por ejemplo 14:30.', tone: 'info' });
            return;
        }

        const objetoEnviar = {
            titulo: nuevoEvento.trim(),
            fecha: fechaSeleccionada,
            hora: horaSeleccionada || null,
            completado: false
        };

        try {
            setGuardando(true);
            const response = await fetch(`${API_BASE_URL}/api/eventos/user/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(objetoEnviar),
            });

            if (response.ok) {
                const eventoCreado = await response.json();
                setListaEventos((prev) => [eventoCreado, ...prev]);
                setNuevoEvento('');
                setHoraSeleccionada('');
                setModalVisible(false);
            } else {
                showPopup({ title: 'Error', message: 'No se pudo guardar el evento en el servidor.', tone: 'error' });
            }
        } catch (error) {
            console.error("Error al guardar:", error);
            showPopup({ title: 'Error de conexión', message: 'No se pudo conectar con el servidor.', tone: 'error' });
        } finally {
            setGuardando(false);
        }
    };

    const abrirFormularioRapido = () => {
        setFechaSeleccionada(typeof fecha === 'string' ? fecha : obtenerFechaLocal());
        setNuevoEvento('');
        setHoraSeleccionada('');
        setModalVisible(true);
    };

    return (
        <View style={styles.wrapper}>
            <ImageBackground 
                source={isDarkMode ? require('../assets/images/FondoLimaOscuro.png') : require('../assets/images/FondoLima.png')}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
            />

            <StatusBar style={isDarkMode ? "light" : "dark"} />

            <SafeAreaView style={styles.body} edges={['top', 'left', 'right']}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    {/* Botón Modo Oscuro / Claro */}
                    <View style={styles.modosContainer}>
                        <ThemeToggle />
                    </View>

                    {/* Logo de la aplicación */}
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../assets/images/LogoLima.png')}
                            style={[styles.logo, { width: width * 0.8 }]}
                            resizeMode="contain"
                        />
                    </View>

                    <View style={styles.headerAgenda}>
                        <View style={styles.tituloSeccionContainer}>
                            <Text style={[styles.tituloSeccion, { color: colors.text }]}>AGENDA</Text>
                            <Text style={[styles.subtitulo, { color: colors.muted }]}>Tus recuerdos y próximos eventos</Text>
                        </View>
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel="Anotar un evento"
                            style={[styles.botonAnotar, { backgroundColor: colors.accent }]}
                            onPress={abrirFormularioRapido}
                        >
                            <Ionicons name="add" size={22} color={isDarkMode ? '#17210c' : '#ffffff'} />
                            <Text style={[styles.botonAnotarTexto, { color: isDarkMode ? '#17210c' : '#ffffff' }]}>Anotar</Text>
                        </Pressable>
                    </View>

                    {/* Lista de eventos y estado vacío */}
                    <View style={[styles.encuadreMes, { backgroundColor: colors.surface, borderColor: isDarkMode ? '#475569' : colors.border }]}>
                        <Text style={[styles.mesTitulo, { color: colors.text }]}>
                            {fecha ? `EVENTOS · ${fecha}` : 'EVENTOS'}
                        </Text>

                        <View style={styles.eventosViewport}>
                            {cargando ? (
                                <View style={styles.estadoLista}>
                                    <ActivityIndicator color={colors.accent} />
                                    <Text style={[styles.estadoTexto, { color: colors.muted }]}>Cargando eventos...</Text>
                                </View>
                            ) : errorCarga ? (
                                <View style={styles.estadoLista}>
                                    <Text style={[styles.estadoTexto, { color: colors.muted }]}>No se pudieron cargar los eventos.</Text>
                                    <Pressable onPress={() => {
                                        setCargando(true);
                                        setErrorCarga(false);
                                        void reintentarCarga();
                                    }}>
                                        <Text style={[styles.reintentarTexto, { color: colors.accent }]}>Reintentar</Text>
                                    </Pressable>
                                </View>
                            ) : listaEventos.length > 0 ? (
                                <ScrollView
                                    style={styles.eventosScroll}
                                    contentContainerStyle={styles.listaEventos}
                                    showsVerticalScrollIndicator
                                    nestedScrollEnabled
                                >
                                    {listaEventos.map((ev) => (
                                        <View key={ev.id} style={[styles.eventoItemCard, { backgroundColor: isDarkMode ? '#263449' : '#f2f6eb' }]}>
                                            <View style={styles.detalleEvento}>
                                                <Text style={[styles.eventoItemTexto, { color: colors.text }]}>{ev.titulo}</Text>
                                                <Text style={[styles.eventoItemFecha, { color: colors.muted }]}>
                                                    {ev.fecha}{ev.hora ? ` · ${ev.hora.slice(0, 5)}` : ''}
                                                </Text>
                                            </View>
                                            <Pressable
                                                accessibilityRole="button"
                                                accessibilityLabel={`Eliminar evento ${ev.titulo}`}
                                                onPress={() => confirmarEliminacion(ev)}
                                                disabled={eliminandoId !== null}
                                                style={styles.botonEliminar}
                                            >
                                                {eliminandoId === ev.id ? (
                                                    <ActivityIndicator size="small" color="#b42318" />
                                                ) : (
                                                    <Ionicons name="trash-outline" size={19} color="#b42318" />
                                                )}
                                            </Pressable>
                                        </View>
                                    ))}
                                </ScrollView>
                            ) : (
                                <View style={styles.estadoLista}>
                                    <Ionicons name="calendar-clear-outline" size={28} color={colors.muted} />
                                    <Text style={[styles.estadoVacioTitulo, { color: colors.text }]}>No hay eventos</Text>
                                    <Text style={[styles.estadoTexto, { color: colors.muted }]}>Anota aquí ese recuerdo o algo que no quieras olvidar.</Text>
                                </View>
                            )}
                        </View>
                    </View>

                </ScrollView>
            </SafeAreaView>
            <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContenido, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={[styles.modalTitulo, { color: colors.text }]}>Nueva anotación</Text>
                                <Text style={[styles.modalSubtitulo, { color: colors.muted }]}>Guarda algo para recordar</Text>
                            </View>
                            <Pressable onPress={() => setModalVisible(false)} accessibilityLabel="Cerrar">
                                <Ionicons name="close" size={24} color={colors.muted} />
                            </Pressable>
                        </View>
                        <TextInput
                            autoFocus
                            accessibilityLabel="Recuerdo o evento"
                            style={[styles.inputEvento, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
                            placeholder="¿Qué quieres recordar?"
                            placeholderTextColor={colors.muted}
                            value={nuevoEvento}
                            onChangeText={setNuevoEvento}
                            returnKeyType="done"
                            onSubmitEditing={() => void guardarEventoAPI()}
                        />
                        <View style={styles.camposFechaHora}>
                            <View style={styles.campoSecundario}>
                                <Text style={[styles.labelCampo, { color: colors.muted }]}>FECHA</Text>
                                <TextInput
                                    style={[styles.inputSecundario, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
                                    value={fechaSeleccionada}
                                    onChangeText={setFechaSeleccionada}
                                    placeholder="AAAA-MM-DD"
                                    placeholderTextColor={colors.muted}
                                    keyboardType="numbers-and-punctuation"
                                />
                            </View>
                            <View style={styles.campoSecundario}>
                                <Text style={[styles.labelCampo, { color: colors.muted }]}>HORA · OPCIONAL</Text>
                                <TextInput
                                    style={[styles.inputSecundario, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
                                    value={horaSeleccionada}
                                    onChangeText={setHoraSeleccionada}
                                    placeholder="HH:MM"
                                    placeholderTextColor={colors.muted}
                                    keyboardType="numbers-and-punctuation"
                                />
                            </View>
                        </View>
                        <Pressable
                            style={[styles.btnGuardarEvento, { backgroundColor: colors.accent }, guardando && styles.botonDeshabilitado]}
                            onPress={() => void guardarEventoAPI()}
                            disabled={guardando}
                        >
                            {guardando ? <ActivityIndicator color={isDarkMode ? '#17210c' : '#ffffff'} /> : (
                                <>
                                    <Ionicons name="checkmark" size={20} color={isDarkMode ? '#17210c' : '#ffffff'} />
                                    <Text style={[styles.btnGuardarTexto, { color: isDarkMode ? '#17210c' : '#ffffff' }]}>Guardar anotación</Text>
                                </>
                            )}
                        </Pressable>
                    </View>
                </View>
            </Modal>
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
        flex: 1,
    },
    tituloSeccion: {
        fontSize: 30,
        fontWeight: '800',
    },
    headerAgenda: {
        width: '88%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    subtitulo: {
        marginTop: 3,
        fontSize: 13,
    },
    botonAnotar: {
        minHeight: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        paddingHorizontal: 14,
        borderRadius: 10,
    },
    botonAnotarTexto: {
        fontSize: 15,
        fontWeight: '700',
    },
    encuadreMes: {
        backgroundColor: 'rgba(50, 80, 180, 0.75)',
        borderRadius: 10,
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
        alignSelf: 'flex-start',
        fontSize: 15,
        fontWeight: '800',
        marginBottom: 12,
    },
    estadoLista: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingHorizontal: 16,
    },
    eventosViewport: {
        width: '100%',
        height: 360,
    },
    eventosScroll: {
        flex: 1,
    },
    estadoVacioTitulo: {
        fontSize: 17,
        fontWeight: '700',
        textAlign: 'center',
    },
    estadoTexto: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
    reintentarTexto: {
        fontSize: 14,
        fontWeight: '700',
        padding: 8,
    },
    listaEventos: {
        width: '100%',
    },
    eventoItemCard: {
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        gap: 12,
    },
    detalleEvento: {
        flex: 1,
        gap: 4,
    },
    botonEliminar: {
        width: 40,
        height: 40,
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: 'rgba(180, 35, 24, 0.08)',
    },
    eventoItemTexto: {
        color: '#111',
        fontWeight: 'bold',
        fontSize: 14,
        flex: 1,
    },
    eventoItemFecha: {
        fontSize: 12,
        fontWeight: '600',
    },
    inputEvento: {
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 14,
        fontSize: 15,
        borderWidth: 1,
    },
    btnGuardarEvento: {
        marginTop: 10,
        minHeight: 48,
        paddingHorizontal: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    btnGuardarTexto: {
        fontWeight: 'bold',
        fontSize: 15,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'rgba(11, 18, 28, 0.62)',
    },
    modalContenido: {
        width: '100%',
        maxWidth: 440,
        alignSelf: 'center',
        padding: 20,
        borderWidth: 1,
        borderRadius: 12,
        elevation: 12,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 18,
    },
    modalTitulo: {
        fontSize: 20,
        fontWeight: '800',
    },
    modalSubtitulo: {
        marginTop: 4,
        fontSize: 13,
    },
    camposFechaHora: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 14,
    },
    campoSecundario: {
        flex: 1,
    },
    labelCampo: {
        marginBottom: 6,
        fontSize: 10,
        fontWeight: '700',
    },
    inputSecundario: {
        minHeight: 46,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderRadius: 8,
        fontSize: 13,
    },
    botonDeshabilitado: {
        opacity: 0.7,
    },
});