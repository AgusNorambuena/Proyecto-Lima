import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  useWindowDimensions,
  ScrollView,
  ImageBackground,
  Animated,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, Link, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { PieChart } from 'react-native-chart-kit';
import ThemeToggle from '../theme/ThemeToggle';
import { useTheme } from '../theme/ThemeProvider';

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

interface EventoAgenda {
  id: number;
  titulo: string;
  fecha: string;
}

interface Gasto {
  id: number;
  nombre: string;
  precio: number;
  fecha: string;
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
  const [eventosPorFecha, setEventosPorFecha] = useState<Record<string, string[]>>({});

  const [gastos, setGastos] = useState<Gasto[]>([]);

  const { isDarkMode } = useTheme();
  const styles = Styles(width, isDarkMode);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isDarkMode ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isDarkMode]);

  // Cargar Contraseñas al montar
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

  // Cargar Eventos y Gastos al enfocar la pantalla
  useFocusEffect(
    useCallback(() => {
      if (!userId) return undefined;
      let activo = true;

      const obtenerEventos = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/eventos/user/${userId}`);
          if (!response.ok) throw new Error('No se pudieron cargar los eventos.');
          const eventos: EventoAgenda[] = await response.json();
          const agrupados = eventos.reduce<Record<string, string[]>>((resultado, evento) => {
            resultado[evento.fecha] = [...(resultado[evento.fecha] ?? []), evento.titulo];
            return resultado;
          }, {});

          if (activo) setEventosPorFecha(agrupados);
        } catch (error) {
          console.error('Error al cargar eventos en inicio:', error);
        }
      };

      const obtenerGastos = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/gastos/user/${userId}`);
          if (response.ok) {
            const data: Gasto[] = await response.json();
            if (activo) setGastos(data);
          }
        } catch (error) {
          console.error('Error al cargar gastos en inicio:', error);
        }
      };

      void obtenerEventos();
      void obtenerGastos();

      return () => { activo = false; };
    }, [userId])
  );

  const toggleVisibilidad = (id: number) => {
    setVisibles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCerrarSesion = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas salir?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sí, salir", 
          style: "destructive",
          onPress: () => {
            router.replace('/');
          }
        }
      ]
    );
  };

  // Cálculo de totales para la gráfica
  const totalServicios = gastos
    .filter((g) => g.categoria === 'SERVICIOS')
    .reduce((acc, curr) => acc + Number(curr.precio || 0), 0);

  const totalInsumos = gastos
    .filter((g) => g.categoria === 'INSUMOS')
    .reduce((acc, curr) => acc + Number(curr.precio || 0), 0);

  const totalExtras = gastos
    .filter((g) => g.categoria === 'EXTRAS')
    .reduce((acc, curr) => acc + Number(curr.precio || 0), 0);

  const totalGastos = totalServicios + totalInsumos + totalExtras;

  const dataPie = [
    {
      name: 'Servicios',
      population: totalServicios,
      color: '#4C82EF',
      legendFontColor: isDarkMode ? '#e2e8f0' : '#333',
      legendFontSize: 12,
    },
    {
      name: 'Insumos',
      population: totalInsumos,
      color: '#9B7ED9',
      legendFontColor: isDarkMode ? '#e2e8f0' : '#333',
      legendFontSize: 12,
    },
    {
      name: 'Extras',
      population: totalExtras,
      color: '#F9B775',
      legendFontColor: isDarkMode ? '#e2e8f0' : '#333',
      legendFontSize: 12,
    },
  ];

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
            <ThemeToggle />
            <Pressable onPress={handleCerrarSesion} style={styles.BotonLogout}>
              <Ionicons name="log-out-outline" size={24} color={isDarkMode ? "#ef4444" : "#dc2626"} />
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
            {/* SECCIÓN CONTRASEÑAS */}
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

            {/* SECCIÓN GASTOS */}
            <Pressable
              style={styles.Gestor}
              onPress={() => router.push({
                pathname: '../gastos',
                params: { userId: userId }
              })}
            >
              <Text style={styles.gestorTexto}>Gastos</Text>
            </Pressable>

            {/* TORTA DE GASTOS */}
            <Pressable
              style={styles.ContenidoGrafico}
              onPress={() => router.push({
                pathname: '../gastos',
                params: { userId: userId }
              })}
            >
              {totalGastos === 0 ? (
                <View style={styles.cardVacia}>
                  <Text style={styles.textoVacio}>No hay gastos registrados</Text>
                </View>
              ) : (
                <PieChart
                  data={dataPie}
                  width={width * 0.85}
                  height={150}
                  chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                />
              )}
            </Pressable>

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

            {/* CALENDARIO */}
            <View style={styles.ContenidoCalendario}>
              <Calendar
                key={isDarkMode ? 'calendar-dark' : 'calendar-light'}
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
                dayComponent={({ date, state, marking, onPress }) => {
                  const fechaDia = date?.dateString ?? '';
                  const nombresEventos = eventosPorFecha[fechaDia] ?? [];
                  const seleccionado = Boolean(marking?.selected);
                  const inactivo = state === 'disabled' || state === 'inactive';

                  return (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`${fechaDia}${nombresEventos.length ? `: ${nombresEventos.join(', ')}` : ''}`}
                      onPress={() => date && onPress?.(date)}
                      style={styles.diaCalendario}
                    >
                      <Text style={[
                        styles.numeroDia,
                        seleccionado && styles.numeroDiaSeleccionado,
                        !seleccionado && inactivo && styles.numeroDiaInactivo,
                        !seleccionado && state === 'today' && styles.numeroDiaHoy,
                      ]}>
                        {date?.day}
                      </Text>
                      {nombresEventos.length > 0 && (
                        <Text
                          style={[styles.nombreEventoDia, seleccionado && styles.nombreEventoDiaSeleccionado]}
                          numberOfLines={1}
                        >
                          {nombresEventos[0]}{nombresEventos.length > 1 ? ` +${nombresEventos.length - 1}` : ''}
                        </Text>
                      )}
                    </Pressable>
                  );
                }}
                theme={{
                  backgroundColor: 'transparent',
                  calendarBackground: isDarkMode ? '#000000' : '#ffffff',
                  textSectionTitleColor: isDarkMode ? '#e2e8f0' : '#374151',
                  selectedDayBackgroundColor: '#4f46e5',
                  selectedDayTextColor: '#ffffff',
                  todayTextColor: isDarkMode ? '#ffffff' : '#3b6812',
                  dayTextColor: isDarkMode ? '#f8fafc' : '#111827',
                  textDisabledColor: isDarkMode ? '#808080' : '#6b7280',
                  textInactiveColor: isDarkMode ? '#808080' : '#6b7280',
                  textDayStyle: { color: isDarkMode ? '#f8fafc' : '#111827' },
                  arrowColor: isDarkMode ? 'hsl(83, 69%, 48%)' : '#4f46e5',
                  monthTextColor: isDarkMode ? '#f8fafc' : '#111827',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    zIndex: 10,
  },
  BotonLogout: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: isDarkMode ? '#17212b' : 'rgba(255, 255, 255, 0.9)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
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
    marginLeft: width * 0.05,
    width: width * 0.35,
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
    backgroundColor: isDarkMode ? '#17212b' : '#72727265',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    height: 135,
    width: width * 0.9,
    alignSelf: "center",
    justifyContent: 'center',
  },
  ContenidoGrafico: {
    backgroundColor: isDarkMode ? '#17212b' : 'rgba(255, 255, 255, 0.92)',
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 15,
    width: width * 0.9,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  ContenidoCalendario: {
    backgroundColor: isDarkMode ? '#17212b' : 'rgba(255, 255, 255, 0.92)',
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
    flex: 1,
  },
  contenedorScroll: {
    alignItems: 'center',
  },
  cardVacia: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  textoVacio: {
    color: isDarkMode ? '#9ca3af' : '#4b5563',
    fontSize: 14,
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: isDarkMode ? '#242f3d' : '#ffffff',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    width: 180,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nombreTexto: {
    fontWeight: 'bold',
    fontSize: 14,
    color: isDarkMode ? '#ffffff' : '#000000',
  },
  usuarioTexto: {
    fontSize: 12,
    color: isDarkMode ? '#9ca3af' : '#6b7280',
  },
  badgeCategoria: {
    backgroundColor: 'hsl(83, 69%, 48%)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeTexto: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
  },
  claveContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: isDarkMode ? '#374151' : '#e5e7eb',
  },
  claveTexto: {
    fontSize: 13,
    color: isDarkMode ? '#d1d5db' : '#334151',
    fontFamily: 'monospace',
  },
  ojoBtn: {
    padding: 2,
  },
  diaCalendario: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    minHeight: 38,
  },
  numeroDia: {
    fontSize: 13,
    fontWeight: '500',
    color: isDarkMode ? '#f8fafc' : '#111827',
  },
  numeroDiaSeleccionado: {
    color: '#ffffff',
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    paddingHorizontal: 6,
    overflow: 'hidden',
  },
  numeroDiaInactivo: {
    color: isDarkMode ? '#808080' : '#6b7280',
  },
  numeroDiaHoy: {
    color: isDarkMode ? '#ffffff' : '#3b6812',
    fontWeight: 'bold',
  },
  nombreEventoDia: {
    fontSize: 9,
    color: isDarkMode ? '#93c5fd' : '#1d4ed8',
    marginTop: 1,
    maxWidth: 40,
  },
  nombreEventoDiaSeleccionado: {
    color: '#ffffff',
  },
});