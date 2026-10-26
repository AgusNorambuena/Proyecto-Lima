import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  Pressable, 
  ImageBackground,
  Modal,
  ActivityIndicator,
  Dimensions,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { PieChart } from 'react-native-chart-kit';
import AppPopup, { useAppPopup } from './components/AppPopup';
import ThemeToggle from '../theme/ThemeToggle';
import { useTheme } from '../theme/ThemeProvider';

interface Gasto {
  id: number;
  nombre: string;
  precio: number;
  fecha: string;
  categoria: string;
}

const screenWidth = Dimensions.get('window').width;
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function GastosScreen() {
    const { userId } = useLocalSearchParams();
    const { popup, showPopup, dismissPopup } = useAppPopup();
    const { isDarkMode } = useTheme();

    const [vista, setVista] = useState<'dia' | 'mes'>('dia');
    const fechaActual = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const mesActualDefecto = fechaActual.slice(0, 7); // YYYY-MM
    const [mesSeleccionado, setMesSeleccionado] = useState<string>(mesActualDefecto);

    const [listaGastos, setListaGastos] = useState<Gasto[]>([]);
    const [cargando, setCargando] = useState(false);

    // Estados para el Modal de Nuevo Gasto
    const [modalVisible, setModalVisible] = useState(false);
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [nuevoPrecio, setNuevoPrecio] = useState('');
    const [nuevaFecha, setNuevaFecha] = useState(fechaActual);
    const [nuevaCategoria, setNuevaCategoria] = useState('SERVICIOS');

    const isDark = isDarkMode;

    const fondoPantalla = isDark 
        ? require('../assets/images/FondoLimaOscuro.png')
        : require('../assets/images/FondoLima.png');

    const fondoEncuadre = isDark 
        ? require('../assets/images/FondoLima.png')
        : require('../assets/images/FondoLimaOscuro.png');

    const colors = {
        textPrimary: isDark ? '#f8fafc' : '#17211a',
        textSecondary: isDark ? '#cbd5e1' : '#475569',
        searchBg: isDark ? 'rgba(15, 23, 42, 0.94)' : 'rgba(255, 255, 255, 0.92)',
        searchBorder: isDark ? '#475569' : '#cbd5e1',
        searchText: isDark ? '#f8fafc' : '#111827',
        cardBg: isDark ? '#1e293b' : '#ffffff',
        cardSubtext: isDark ? '#cbd5e1' : '#64748b',
        claveBg: isDark ? '#0f172a' : '#f1f5f9',
        claveText: isDark ? '#f8fafc' : '#1f2937',
        badgeBg: isDark ? '#334155' : '#e2e8f0',
        badgeText: isDark ? '#e2e8f0' : '#475569',
    };

    const obtenerGastosAPI = async () => {
        if (!userId) return;
        try {
            setCargando(true);
            const response = await fetch(`${API_BASE_URL}/api/gastos/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener los gastos desde el servidor.');
            }

            const data: Gasto[] = await response.json();
            setListaGastos(data);
        } catch (error) {
            console.error(error);
            showPopup({ 
                title: 'Error de conexión', 
                message: 'No se pudo conectar con el servidor para cargar los gastos.', 
                tone: 'error' 
            });
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerGastosAPI();
    }, [userId]);

    const guardarNuevoGasto = async () => {
        if (!nuevoNombre.trim() || !nuevoPrecio.trim()) {
            showPopup({ 
                title: 'Campos incompletos', 
                message: 'Por favor completa el nombre y el precio del gasto antes de continuar.', 
                tone: 'info' 
            });
            return;
        }

        const fechaFinal = nuevaFecha.trim() || fechaActual;
        const regexFecha = /^\d{4}-\d{2}-\d{2}$/;

        if (!regexFecha.test(fechaFinal)) {
            showPopup({ 
                title: 'Fecha inválida', 
                message: 'La fecha debe tener el formato exacto YYYY-MM-DD (por ejemplo: 2026-10-22).', 
                tone: 'error' 
            });
            return;
        }

        const objetoEnviar = {
            nombre: nuevoNombre,
            precio: parseFloat(nuevoPrecio),
            fecha: fechaFinal,
            categoria: nuevaCategoria,
            user: {
                id: Number(userId)
            }
        };

        try {
            setCargando(true);
            const response = await fetch(`${API_BASE_URL}/api/gastos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(objetoEnviar),
            });

            if (!response.ok) {
                throw new Error('Error al guardar el gasto en el servidor');
            }

            const nuevoGastoGuardado: Gasto = await response.json();
            setListaGastos((prev) => [nuevoGastoGuardado, ...prev]);
            setMesSeleccionado(fechaFinal.slice(0, 7));

            setNuevoNombre('');
            setNuevoPrecio('');
            setNuevaFecha(fechaActual);
            setNuevaCategoria('SERVICIOS');
            setModalVisible(false);

            showPopup({ 
                title: '¡Gasto Guardado!', 
                message: 'El registro se ha guardado y sincronizado correctamente.', 
                tone: 'success' 
            });
        } catch (error) {
            console.error(error);
            showPopup({ 
                title: 'Error al registrar', 
                message: 'No se pudo guardar el gasto en la base de datos. Verifica los datos e inténtalo de nuevo.', 
                tone: 'error' 
            });
        } finally {
            setCargando(false);
        }
    };

    // Meses únicos disponibles para el filtro
    const mesesDisponibles = Array.from(
        new Set([mesActualDefecto, ...listaGastos.map((g) => g.fecha ? g.fecha.slice(0, 7) : mesActualDefecto)])
    ).filter(Boolean).sort().reverse();

    useEffect(() => {
        if (mesesDisponibles.length > 0 && !mesesDisponibles.includes(mesSeleccionado)) {
            setMesSeleccionado(mesesDisponibles[0]);
        }
    }, [mesesDisponibles, mesSeleccionado]);

    // Filtrado de gastos por día actual o mes seleccionado
    const gastosFiltrados = listaGastos.filter((g) => {
        if (!g.fecha) return false;
        if (vista === 'dia') {
            return g.fecha === fechaActual;
        } else {
            return g.fecha.startsWith(mesSeleccionado);
        }
    });

    const totalGastos = gastosFiltrados.reduce((acc, curr) => acc + Number(curr.precio || 0), 0);
    const totalServicios = gastosFiltrados.filter((g) => g.categoria === 'SERVICIOS').reduce((acc, curr) => acc + Number(curr.precio || 0), 0);
    const totalInsumos = gastosFiltrados.filter((g) => g.categoria === 'INSUMOS').reduce((acc, curr) => acc + Number(curr.precio || 0), 0);
    const totalExtras = gastosFiltrados.filter((g) => g.categoria === 'EXTRAS').reduce((acc, curr) => acc + Number(curr.precio || 0), 0);

    // Agrupación para vista mensual
    const gastosAgrupadosPorFecha = gastosFiltrados.reduce((acc: { [key: string]: { gastos: Gasto[]; totalDia: number } }, gasto) => {
        const fecha = gasto.fecha;
        const precioNum = Number(gasto.precio || 0);
        if (!acc[fecha]) {
            acc[fecha] = { gastos: [], totalDia: 0 };
        }
        acc[fecha].gastos.push(gasto);
        acc[fecha].totalDia += precioNum;
        return acc;
    }, {});

    const listaFechas = Object.keys(gastosAgrupadosPorFecha).sort().reverse();

    const dataPie = [
        { name: 'Servicios', population: totalServicios, color: '#4C82EF', legendFontColor: colors.textPrimary, legendFontSize: 12 },
        { name: 'Insumos', population: totalInsumos, color: '#9B7ED9', legendFontColor: colors.textPrimary, legendFontSize: 12 },
        { name: 'Extras', population: totalExtras, color: '#F9B775', legendFontColor: colors.textPrimary, legendFontSize: 12 },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <ImageBackground source={fondoPantalla} style={styles.bgImage} resizeMode="cover">
                <ScrollView 
                    style={styles.container} 
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={{ alignItems: 'flex-start', paddingHorizontal: 20, paddingTop: 8 }}>
                        <ThemeToggle />
                    </View>

                    <View style={{ padding: 20 }}>
                        <Text style={[styles.titulo, { color: colors.textPrimary }]}>
                            Gastos
                        </Text>
                        <Text style={[styles.textoNormal, { color: colors.textSecondary }]}>
                            Administra y controla tus servicios, insumos y gastos extras de forma sencilla.
                        </Text>
                    </View>

                    {/* Botón Añadir Gasto */}
                    <View style={{ paddingHorizontal: 20, marginBottom: 15 }}>
                        <Pressable 
                            style={styles.btnAgregar} 
                            onPress={() => setModalVisible(true)}
                        >
                            <Ionicons name="add-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                            <Text style={styles.btnAgregarTexto}>Añadir Nuevo Gasto</Text>
                        </Pressable>
                    </View>

                    {/* Selector de Vista Día / Mes */}
                    <View style={[styles.selectorVista, { backgroundColor: colors.searchBg, borderColor: colors.searchBorder }]}>
                        <Pressable
                            style={[styles.btnVista, vista === 'dia' && styles.btnVistaActiva]}
                            onPress={() => setVista('dia')}
                        >
                            <Text style={[styles.txtVista, vista === 'dia' && styles.txtVistaActiva]}>Día Actual</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.btnVista, vista === 'mes' && styles.btnVistaActiva]}
                            onPress={() => setVista('mes')}
                        >
                            <Text style={[styles.txtVista, vista === 'mes' && styles.txtVistaActiva]}>Por Mes</Text>
                        </Pressable>
                    </View>

                    {/* Selector de Mes si está activo */}
                    {vista === 'mes' && (
                        <View style={[styles.filtroMesContainer, { backgroundColor: colors.searchBg, borderColor: colors.searchBorder }]}>
                            <Text style={[styles.filtroMesLabel, { color: colors.textPrimary }]}>Filtrar Mes:</Text>
                            <View style={{ flex: 1 }}>
                                <Picker
                                    selectedValue={mesSeleccionado}
                                    onValueChange={(itemValue) => setMesSeleccionado(itemValue)}
                                    style={{ color: colors.searchText }}
                                    dropdownIconColor={isDark ? '#fff' : '#000'}
                                >
                                    {mesesDisponibles.map((m) => (
                                        <Picker.Item key={m} label={m} value={m} color={isDark ? '#000' : '#000'} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    )}

                    {/* Contenedor de Registros */}
                    <ImageBackground 
                        source={fondoEncuadre} 
                        style={styles.encuadreContraseñas}
                        imageStyle={styles.encuadreImageRadius}
                        resizeMode="cover"
                    >
                        <Text style={[styles.subTituloCard, { color: colors.textPrimary }]}>
                            {vista === 'dia' ? 'Registros del Día' : `Gastos de ${mesSeleccionado}`}
                        </Text>

                        {cargando && listaGastos.length === 0 ? (
                            <View style={{ paddingVertical: 20 }}>
                                <ActivityIndicator size="small" color={colors.cardSubtext} />
                                <Text style={[styles.vacioTexto, { color: colors.cardSubtext }]}>
                                    Cargando gastos...
                                </Text>
                            </View>
                        ) : gastosFiltrados.length === 0 ? (
                            <Text style={[styles.vacioTexto, { color: colors.cardSubtext }]}>
                                No hay gastos registrados en este período.
                            </Text>
                        ) : vista === 'dia' ? (
                            gastosFiltrados.map((item) => (
                                <View key={item.id} style={[styles.card, { backgroundColor: colors.cardBg }]}>
                                    <View style={styles.cardHeader}>
                                        <View style={{ flex: 1, marginRight: 8 }}>
                                            <Text style={[styles.nombreTexto, { color: colors.claveText }]}>
                                                {item.nombre}
                                            </Text>
                                            <Text style={[styles.usuarioTexto, { color: colors.cardSubtext }]}>
                                                {item.categoria}
                                            </Text>
                                        </View>
                                        <Text style={[styles.precioTexto, { color: '#4f46e5' }]}>
                                            ${item.precio}
                                        </Text>
                                    </View>
                                </View>
                            ))
                        ) : (
                            listaFechas.map((fecha) => {
                                const grupo = gastosAgrupadosPorFecha[fecha];
                                return (
                                    <View key={fecha} style={[styles.grupoContainer, { backgroundColor: colors.cardBg }]}>
                                        <View style={styles.fechaHeaderRow}>
                                            <Text style={[styles.fechaHeaderTxt, { color: colors.textPrimary }]}>{fecha}</Text>
                                            <Text style={[styles.totalFechaTxt, { color: '#4f46e5' }]}>Total: ${grupo.totalDia}</Text>
                                        </View>
                                        {grupo.gastos.map((gasto) => (
                                            <View key={gasto.id} style={styles.gastoItemSub}>
                                                <View>
                                                    <Text style={[styles.nombreTexto, { color: colors.claveText }]}>{gasto.nombre}</Text>
                                                    <Text style={[styles.usuarioTexto, { color: colors.cardSubtext }]}>{gasto.categoria}</Text>
                                                </View>
                                                <Text style={[styles.gastoPrecioSub, { color: colors.textPrimary }]}>${gasto.precio}</Text>
                                            </View>
                                        ))}
                                    </View>
                                );
                            })
                        )}
                    </ImageBackground>

                    {/* Resumen y Gráfico de Torta */}
                    <View style={[styles.statsContainer, { backgroundColor: colors.cardBg }]}>
                        <Text style={[styles.statsTitle, { color: colors.textPrimary }]}>
                            Resumen Estadístico ({vista === 'dia' ? 'Día' : mesSeleccionado})
                        </Text>
                        <Text style={[styles.statsTextTotal, { color: '#4f46e5' }]}>
                            Total General: ${totalGastos}
                        </Text>
                        <Text style={[styles.statsText, { color: colors.textSecondary }]}>• Servicios: ${totalServicios}</Text>
                        <Text style={[styles.statsText, { color: colors.textSecondary }]}>• Insumos: ${totalInsumos}</Text>
                        <Text style={[styles.statsText, { color: colors.textSecondary }]}>• Extras: ${totalExtras}</Text>

                        {totalGastos > 0 && (
                            <View style={{ alignItems: 'center', marginTop: 15 }}>
                                <PieChart
                                    data={dataPie}
                                    width={screenWidth - 60}
                                    height={180}
                                    chartConfig={{
                                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    }}
                                    accessor="population"
                                    backgroundColor="transparent"
                                    paddingLeft="15"
                                    absolute
                                />
                            </View>
                        )}
                    </View>

                    {/* Modal para Crear Gasto */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.modalBg}>
                            <View style={[styles.modalCard, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}>
                                <Text style={[styles.modalTitulo, { color: isDark ? '#ffffff' : '#000000' }]}>
                                    Registrar Nuevo Gasto
                                </Text>

                                <Text style={[styles.label, { color: colors.textSecondary }]}>Concepto / Nombre:</Text>
                                <TextInput
                                    style={[styles.modalInput, { color: isDark ? '#fff' : '#000', borderColor: colors.searchBorder }]}
                                    placeholder="Ej: Luz, Internet, Compra..."
                                    placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                                    value={nuevoNombre}
                                    onChangeText={setNuevoNombre}
                                />

                                <Text style={[styles.label, { color: colors.textSecondary }]}>Precio ($):</Text>
                                <TextInput
                                    style={[styles.modalInput, { color: isDark ? '#fff' : '#000', borderColor: colors.searchBorder }]}
                                    placeholder="0.00"
                                    placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                                    keyboardType="numeric"
                                    value={nuevoPrecio}
                                    onChangeText={setNuevoPrecio}
                                />

                                <Text style={[styles.label, { color: colors.textSecondary }]}>Fecha (YYYY-MM-DD):</Text>
                                <TextInput
                                    style={[styles.modalInput, { color: isDark ? '#fff' : '#000', borderColor: colors.searchBorder }]}
                                    placeholder={fechaActual}
                                    placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                                    value={nuevaFecha}
                                    onChangeText={setNuevaFecha}
                                />

                                <Text style={[styles.label, { color: colors.textSecondary }]}>Categoría:</Text>
                                <View style={[styles.modalInput, { padding: 0, borderColor: colors.searchBorder }]}>
                                    <Picker
                                        selectedValue={nuevaCategoria}
                                        onValueChange={(itemValue) => setNuevaCategoria(itemValue)}
                                        style={{ color: isDark ? '#fff' : '#000' }}
                                        dropdownIconColor={isDark ? '#fff' : '#000'}
                                    >
                                        <Picker.Item label="Servicios" value="SERVICIOS" color={isDark ? '#000' : '#000'} />
                                        <Picker.Item label="Insumos" value="INSUMOS" color={isDark ? '#000' : '#000'} />
                                        <Picker.Item label="Extras" value="EXTRAS" color={isDark ? '#000' : '#000'} />
                                    </Picker>
                                </View>

                                <View style={styles.modalAcciones}>
                                    <Pressable 
                                        style={[styles.btnModal, { backgroundColor: isDark ? '#334155' : '#e5e7eb' }]}
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Text style={{ color: isDark ? '#f8fafc' : '#374151', fontWeight: '600' }}>Cancelar</Text>
                                    </Pressable>

                                    <Pressable 
                                        style={[styles.btnModal, { backgroundColor: '#4f46e5' }]} 
                                        onPress={guardarNuevoGasto}
                                    >
                                        <Text style={{ color: '#ffffff', fontWeight: '600' }}>Guardar</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </Modal>

                </ScrollView>
            </ImageBackground>
            <AppPopup popup={popup} onDismiss={dismissPopup} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  container: {
    flex: 1,
  },
  titulo: {
    fontSize: 38,
    fontWeight: 'bold',
  },
  textoNormal: {
    fontSize: 16,
    marginTop: 4,
  },
  btnAgregar: {
    backgroundColor: '#4f46e5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnAgregarTexto: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectorVista: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 20,
    padding: 4,
    marginBottom: 12,
  },
  btnVista: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  btnVistaActiva: {
    backgroundColor: '#4f46e5',
  },
  txtVista: {
    fontWeight: 'bold',
    color: '#64748b',
  },
  txtVistaActiva: {
    color: '#ffffff',
  },
  filtroMesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    height: 50,
    marginBottom: 12,
  },
  filtroMesLabel: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  encuadreContraseñas: {
    padding: 12,
    marginHorizontal: 20,
    marginTop: 5,
    overflow: 'hidden',
  },
  encuadreImageRadius: {
    borderRadius: 12,
  },
  subTituloCard: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  vacioTexto: {
    textAlign: 'center',
    paddingVertical: 12,
    fontSize: 14,
  },
  card: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nombreTexto: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  usuarioTexto: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
  precioTexto: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  grupoContainer: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  fechaHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 4,
    marginBottom: 6,
  },
  fechaHeaderTxt: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  totalFechaTxt: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  gastoItemSub: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    paddingLeft: 6,
  },
  gastoPrecioSub: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statsContainer: {
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 12,
    padding: 15,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  statsTextTotal: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  statsText: {
    fontSize: 14,
    marginBottom: 2,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 10,
    marginBottom: 4,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
  },
  modalAcciones: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 15,
  },
  btnModal: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
});