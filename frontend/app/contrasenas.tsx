import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  useColorScheme,
  ImageBackground,
  Modal,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import MenuContraseñas from './components/menuContasenas';

// ─────────────────────────────────────────────────────────────
// CONFIGURACIÓN DE LA API
// - Emulador Android:        10.0.2.2
// - Simulador iOS / Web:     localhost
// - Celular físico (Expo Go): la IP de tu PC en la red, ej: 192.168.1.15
// ─────────────────────────────────────────────────────────────
const HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const API_URL = `http://${HOST}:8080/api/Passwords`;

// Categorías disponibles al crear/editar (ajustalas a las de tu MenuContraseñas)
const CATEGORIAS = ['Contraseñas Personales', 'Trabajo y Servidores', 'Redes Sociales'];

// ─────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────
interface Credencial {
  id: number;
  nombre: string;
  usuario: string;
  clave: string;
  categoria: string;
  url: string;
  notas: string;
}

type FormCredencial = Omit<Credencial, 'id'>;

const FORM_VACIO: FormCredencial = {
  nombre: '',
  usuario: '',
  clave: '',
  categoria: CATEGORIAS[0],
  url: '',
  notas: '',
};

// ─────────────────────────────────────────────────────────────
// MAPEO FRONT <-> BACK
// Front: nombre / usuario / clave  →  Back: titulo / usuarioCuenta / contrasenia
// ─────────────────────────────────────────────────────────────
const desdeApi = (p: any): Credencial => ({
  id: p.id,
  nombre: p.titulo ?? '',
  usuario: p.usuarioCuenta ?? '',
  clave: p.contrasenia ?? '',
  categoria: p.categoria ?? 'Sin categoría',
  url: p.url ?? '',
  notas: p.notas ?? '',
});

const haciaApi = (c: FormCredencial) => ({
  titulo: c.nombre.trim(),
  usuarioCuenta: c.usuario.trim(),
  contrasenia: c.clave,
  categoria: c.categoria,
  url: c.url.trim(),
  notas: c.notas.trim(),
});

// Generador de contraseñas (nota: Math.random no es criptográficamente seguro;
// para producción conviene reemplazarlo por expo-crypto)
const generarClave = (largo = 16) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*?';
  let resultado = '';
  for (let i = 0; i < largo; i++) {
    resultado += chars[Math.floor(Math.random() * chars.length)];
  }
  return resultado;
};

// ─────────────────────────────────────────────────────────────
// PANTALLA
// ─────────────────────────────────────────────────────────────
export default function Contraseñas() {
  // Datos
  const [credenciales, setCredenciales] = useState<Credencial[]>([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Búsqueda, filtro y visibilidad
  const [texto, setTexto] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas las contraseñas');
  const [visibles, setVisibles] = useState<{ [key: number]: boolean }>({});

  // Modal de crear / editar
  const [modalVisible, setModalVisible] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [form, setForm] = useState<FormCredencial>(FORM_VACIO);
  const [claveFormVisible, setClaveFormVisible] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const fondoPantalla = isDark
    ? require('../assets/images/FondoLima.png')
    : require('../assets/images/FondoLimaOscuro.png');

  const fondoEncuadre = isDark
    ? require('../assets/images/FondoLimaOscuro.png') // Invertido: claro en dark mode
    : require('../assets/images/FondoLima.png'); // Invertido: oscuro en light mode

  const colors = {
    textPrimary: isDark ? '#ffffff' : '#000000',
    textSecondary: isDark ? '#ffffff' : '#4b5563',
    searchBg: isDark ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255, 255, 255, 0.85)',
    searchBorder: isDark ? '#333333' : '#ccc',
    searchText: isDark ? '#ffffff' : '#000000',
    // Tarjetas internas
    cardBg: isDark ? '#ffffff' : '#1e1e1e',
    cardText: isDark ? '#111827' : '#ffffff',
    cardSubtext: isDark ? '#6b7280' : '#a1a1aa',
    claveBg: isDark ? '#f9fafb' : '#2a2a2a',
    claveText: isDark ? '#374151' : '#f3f4f6',
    badgeBg: isDark ? '#f3f4f6' : '#333333',
    badgeText: isDark ? '#4b5563' : '#d1d5db',
    // Botones y modal
    accent: '#84cc16',
    accentText: '#1a2e05',
    danger: '#ef4444',
    modalBg: isDark ? '#1e1e1e' : '#ffffff',
    modalText: isDark ? '#ffffff' : '#111827',
    modalInputBg: isDark ? '#2a2a2a' : '#f3f4f6',
    modalBorder: isDark ? '#3f3f46' : '#d4d4d8',
    modalPlaceholder: isDark ? '#71717a' : '#9ca3af',
  };

  // ───────────── READ: listar ─────────────
  const cargar = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setCredenciales(data.map(desdeApi));
    } catch (e) {
      setError('No se pudo conectar con el servidor. Revisá que el backend esté encendido y que la URL sea correcta.');
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // ───────────── CREATE / UPDATE ─────────────
  const abrirNueva = () => {
    setEditandoId(null);
    setForm(FORM_VACIO);
    setClaveFormVisible(false);
    setModalVisible(true);
  };

  const abrirEdicion = (item: Credencial) => {
    setEditandoId(item.id);
    setForm({
      nombre: item.nombre,
      usuario: item.usuario,
      clave: item.clave,
      categoria: item.categoria,
      url: item.url,
      notas: item.notas,
    });
    setClaveFormVisible(false);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setEditandoId(null);
    setForm(FORM_VACIO);
  };

  const guardar = async () => {
    if (!form.nombre.trim() || !form.usuario.trim() || !form.clave.trim()) {
      Alert.alert('Faltan datos', 'Completá el nombre, el usuario y la contraseña.');
      return;
    }

    const editando = editandoId !== null;
    setGuardando(true);
    try {
      const res = await fetch(editando ? `${API_URL}/${editandoId}` : API_URL, {
        method: editando ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(haciaApi(form)),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);

      const guardada = desdeApi(await res.json());
      setCredenciales((prev) =>
        editando
          ? prev.map((c) => (c.id === guardada.id ? guardada : c))
          : [guardada, ...prev]
      );
      cerrarModal();
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar la contraseña. Probá de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  // ───────────── DELETE ─────────────
  const eliminar = (item: Credencial) => {
    Alert.alert('Eliminar contraseña', `¿Seguro que querés eliminar "${item.nombre}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await fetch(`${API_URL}/${item.id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error(`Error ${res.status}`);
            setCredenciales((prev) => prev.filter((c) => c.id !== item.id));
          } catch (e) {
            Alert.alert('Error', 'No se pudo eliminar la contraseña. Probá de nuevo.');
          }
        },
      },
    ]);
  };

  // ───────────── Utilidades de la pantalla ─────────────
  const toggleVisibilidad = (id: number) => {
    setVisibles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const actualizarForm = (campo: keyof FormCredencial, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const contraseñasFiltradas = credenciales.filter((item) => {
    const coincideTexto =
      item.nombre.toLowerCase().includes(texto.toLowerCase()) ||
      item.usuario.toLowerCase().includes(texto.toLowerCase());

    const coincideCategoria =
      categoriaSeleccionada === 'Todas las contraseñas' ||
      item.categoria === categoriaSeleccionada;

    return coincideTexto && coincideCategoria;
  });

  // ───────────── Contenido del encuadre ─────────────
  const renderLista = () => {
    if (cargando) {
      return <ActivityIndicator size="large" color={colors.accent} style={{ paddingVertical: 20 }} />;
    }

    if (error) {
      return (
        <View style={styles.estadoContainer}>
          <Text style={[styles.vacioTexto, { color: colors.cardSubtext }]}>{error}</Text>
          <Pressable
            onPress={() => {
              setCargando(true);
              cargar();
            }}
            style={[styles.botonSecundario, { borderColor: colors.accent }]}
          >
            <Text style={{ color: colors.accent, fontWeight: '600' }}>Reintentar</Text>
          </Pressable>
        </View>
      );
    }

    if (contraseñasFiltradas.length === 0) {
      return (
        <Text style={[styles.vacioTexto, { color: colors.cardSubtext }]}>
          {credenciales.length === 0
            ? 'Todavía no guardaste contraseñas. Tocá "Nueva contraseña" para agregar la primera.'
            : 'No se encontraron contraseñas.'}
        </Text>
      );
    }

    return contraseñasFiltradas.map((item) => {
      const esVisible = visibles[item.id];

      return (
        <View key={item.id} style={[styles.card, { backgroundColor: colors.cardBg }]}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={[styles.nombreTexto, { color: colors.cardText }]}>{item.nombre}</Text>
              <Text style={[styles.usuarioTexto, { color: colors.cardSubtext }]}>{item.usuario}</Text>
            </View>
            <View style={[styles.badgeCategoria, { backgroundColor: colors.badgeBg }]}>
              <Text style={[styles.badgeTexto, { color: colors.badgeText }]}>{item.categoria}</Text>
            </View>
          </View>

          <View
            style={[
              styles.claveContainer,
              { backgroundColor: colors.claveBg, borderColor: colors.searchBorder },
            ]}
          >
            <Text style={[styles.claveTexto, { color: colors.claveText }]}>
              {esVisible ? item.clave : '••••••••••••'}
            </Text>
            <View style={styles.accionesRow}>
              <Pressable onPress={() => toggleVisibilidad(item.id)} style={styles.ojoBtn}>
                <Ionicons
                  name={esVisible ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={isDark ? '#6b7280' : '#9ca3af'}
                />
              </Pressable>
              <Pressable onPress={() => abrirEdicion(item)} style={styles.ojoBtn}>
                <Ionicons name="create-outline" size={20} color={isDark ? '#6b7280' : '#9ca3af'} />
              </Pressable>
              <Pressable onPress={() => eliminar(item)} style={styles.ojoBtn}>
                <Ionicons name="trash-outline" size={20} color={colors.danger} />
              </Pressable>
            </View>
          </View>
        </View>
      );
    });
  };

  // ───────────── Render ─────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={fondoPantalla} style={styles.bgImage} resizeMode="cover">
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={false}
          refreshControl={
            <RefreshControl
              refreshing={refrescando}
              onRefresh={() => {
                setRefrescando(true);
                cargar();
              }}
              tintColor={colors.accent}
            />
          }
        >
          <View style={{ padding: 20 }}>
            <Text style={[styles.titulo, { color: colors.textPrimary }]}>Contraseñas</Text>
            <Text style={[styles.textoNormal, { color: colors.textSecondary }]}>
              Aqui puedes guardar tus contraseñas de forma segura y acceder a ellas cuando lo necesites.
              Asegúrate de mantener tu información protegida y no compartir tus contraseñas con nadie.
            </Text>
          </View>

          <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
            <Text style={[styles.titulofuncional, { color: colors.textPrimary }]}>Funcionalidades</Text>
            <Text style={[styles.textoNormal, { color: colors.textSecondary }]}>
              - Crear y gestionar contraseñas{'\n'}
              - Generar contraseñas seguras{'\n'}
              - Buscar y filtrar contraseñas
            </Text>
          </View>

          <View
            style={[
              styles.searchContainer,
              { backgroundColor: colors.searchBg, borderColor: colors.searchBorder },
            ]}
          >
            <Ionicons
              name="search"
              size={20}
              color={isDark ? '#a1a1aa' : 'black'}
              style={styles.icon}
            />
            <TextInput
              style={[styles.input, { color: colors.searchText }]}
              placeholder="Buscar Contraseña..."
              placeholderTextColor={isDark ? '#71717a' : '#888'}
              value={texto}
              onChangeText={setTexto}
            />
          </View>

          <MenuContraseñas
            textoBusqueda={texto}
            onSeleccionarCategoria={(cat) => setCategoriaSeleccionada(cat)}
          />

          {/* Botón para crear */}
          <Pressable
            onPress={abrirNueva}
            style={[styles.botonNueva, { backgroundColor: colors.accent }]}
          >
            <Ionicons name="add" size={22} color={colors.accentText} />
            <Text style={[styles.botonNuevaTexto, { color: colors.accentText }]}>Nueva contraseña</Text>
          </Pressable>

          <ImageBackground
            source={fondoEncuadre}
            style={styles.encuadreContraseñas}
            imageStyle={styles.encuadreImageRadius}
            resizeMode="cover"
          >
            {renderLista()}
          </ImageBackground>
        </ScrollView>
      </ImageBackground>

      {/* ───────────── Modal crear / editar ───────────── */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={cerrarModal}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={[styles.modalCard, { backgroundColor: colors.modalBg }]}>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalTitulo, { color: colors.modalText }]}>
                {editandoId !== null ? 'Editar contraseña' : 'Nueva contraseña'}
              </Text>

              <Text style={[styles.label, { color: colors.modalText }]}>Nombre</Text>
              <TextInput
                style={[
                  styles.modalInput,
                  { backgroundColor: colors.modalInputBg, borderColor: colors.modalBorder, color: colors.modalText },
                ]}
                placeholder="Ej: Gmail Personal"
                placeholderTextColor={colors.modalPlaceholder}
                value={form.nombre}
                onChangeText={(v) => actualizarForm('nombre', v)}
              />

              <Text style={[styles.label, { color: colors.modalText }]}>Usuario o email</Text>
              <TextInput
                style={[
                  styles.modalInput,
                  { backgroundColor: colors.modalInputBg, borderColor: colors.modalBorder, color: colors.modalText },
                ]}
                placeholder="Ej: santino@gmail.com"
                placeholderTextColor={colors.modalPlaceholder}
                autoCapitalize="none"
                value={form.usuario}
                onChangeText={(v) => actualizarForm('usuario', v)}
              />

              <Text style={[styles.label, { color: colors.modalText }]}>Contraseña</Text>
              <View
                style={[
                  styles.modalInputRow,
                  { backgroundColor: colors.modalInputBg, borderColor: colors.modalBorder },
                ]}
              >
                <TextInput
                  style={[styles.modalInputFlex, { color: colors.modalText }]}
                  placeholder="Tu contraseña"
                  placeholderTextColor={colors.modalPlaceholder}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={!claveFormVisible}
                  value={form.clave}
                  onChangeText={(v) => actualizarForm('clave', v)}
                />
                <Pressable onPress={() => setClaveFormVisible((v) => !v)} style={styles.ojoBtn}>
                  <Ionicons
                    name={claveFormVisible ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.modalPlaceholder}
                  />
                </Pressable>
              </View>
              <Pressable
                onPress={() => {
                  actualizarForm('clave', generarClave());
                  setClaveFormVisible(true);
                }}
                style={styles.generarBtn}
              >
                <Ionicons name="key-outline" size={16} color={colors.accent} />
                <Text style={{ color: colors.accent, fontWeight: '600', marginLeft: 6 }}>
                  Generar contraseña segura
                </Text>
              </Pressable>

              <Text style={[styles.label, { color: colors.modalText }]}>Categoría</Text>
              <View style={styles.chipsRow}>
                {CATEGORIAS.map((cat) => {
                  const activa = form.categoria === cat;
                  return (
                    <Pressable
                      key={cat}
                      onPress={() => actualizarForm('categoria', cat)}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: activa ? colors.accent : colors.modalInputBg,
                          borderColor: activa ? colors.accent : colors.modalBorder,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: activa ? colors.accentText : colors.modalText,
                          fontSize: 13,
                          fontWeight: activa ? '700' : '400',
                        }}
                      >
                        {cat}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={[styles.label, { color: colors.modalText }]}>URL (opcional)</Text>
              <TextInput
                style={[
                  styles.modalInput,
                  { backgroundColor: colors.modalInputBg, borderColor: colors.modalBorder, color: colors.modalText },
                ]}
                placeholder="https://..."
                placeholderTextColor={colors.modalPlaceholder}
                autoCapitalize="none"
                keyboardType="url"
                value={form.url}
                onChangeText={(v) => actualizarForm('url', v)}
              />

              <Text style={[styles.label, { color: colors.modalText }]}>Notas (opcional)</Text>
              <TextInput
                style={[
                  styles.modalInput,
                  styles.modalInputMultiline,
                  { backgroundColor: colors.modalInputBg, borderColor: colors.modalBorder, color: colors.modalText },
                ]}
                placeholder="Algo que quieras recordar"
                placeholderTextColor={colors.modalPlaceholder}
                multiline
                value={form.notas}
                onChangeText={(v) => actualizarForm('notas', v)}
              />

              <View style={styles.modalBotones}>
                <Pressable
                  onPress={cerrarModal}
                  disabled={guardando}
                  style={[styles.botonSecundario, { borderColor: colors.modalBorder, flex: 1 }]}
                >
                  <Text style={{ color: colors.modalText, fontWeight: '600' }}>Cancelar</Text>
                </Pressable>
                <Pressable
                  onPress={guardar}
                  disabled={guardando}
                  style={[
                    styles.botonPrimario,
                    { backgroundColor: colors.accent, opacity: guardando ? 0.6 : 1, flex: 1 },
                  ]}
                >
                  {guardando ? (
                    <ActivityIndicator color={colors.accentText} />
                  ) : (
                    <Text style={{ color: colors.accentText, fontWeight: '700' }}>Guardar</Text>
                  )}
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
// ESTILOS
// ─────────────────────────────────────────────────────────────
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 45,
    marginHorizontal: 20,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  botonNueva: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    height: 45,
    marginHorizontal: 20,
    marginTop: 15,
  },
  botonNuevaTexto: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 6,
  },
  encuadreContraseñas: {
    padding: 12,
    marginHorizontal: 20,
    marginTop: 15,
    overflow: 'hidden',
  },
  encuadreImageRadius: {
    borderRadius: 12,
  },
  estadoContainer: {
    alignItems: 'center',
    paddingVertical: 8,
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
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  nombreTexto: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  usuarioTexto: {
    fontSize: 13,
  },
  badgeCategoria: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeTexto: {
    fontSize: 11,
    fontWeight: '500',
  },
  claveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
  },
  claveTexto: {
    fontSize: 14,
    fontFamily: 'monospace',
    flexShrink: 1,
  },
  accionesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ojoBtn: {
    padding: 4,
    marginLeft: 4,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    borderRadius: 14,
    padding: 18,
    maxHeight: '90%',
  },
  modalTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 15,
  },
  modalInputMultiline: {
    height: 80,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  modalInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  modalInputFlex: {
    flex: 1,
    fontSize: 15,
  },
  generarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  modalBotones: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  botonPrimario: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    height: 44,
  },
  botonSecundario: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    height: 44,
    paddingHorizontal: 16,
    marginTop: 8,
  },
});