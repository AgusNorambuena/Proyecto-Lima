import React, { useState } from 'react';
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
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import MenuContraseñas from './components/menuContasenas';

interface Credencial {
  id: string;
  nombre: string;
  usuario: string;
  clave: string;
  categoria: string;
}

const DATOS_MOCK: Credencial[] = [
  { id: '1', nombre: 'Gmail Personal', usuario: 'santino@gmail.com', clave: 'MiClaveSegura123!', categoria: 'Contraseñas Personales' },
  { id: '2', nombre: 'Netflix', usuario: 'santino@gmail.com', clave: 'Peliculas2026*', categoria: 'Contraseñas Personales' },
  { id: '3', nombre: 'Servidor VPS', usuario: 'dev_user', clave: 'ServerPass#88', categoria: 'Trabajo y Servidores' },
  { id: '4', nombre: 'Instagram', usuario: '@santino_ig', clave: 'SocialMedia99!', categoria: 'Redes Sociales' },
];

export default function Contraseñas() {
    const [texto, setTexto] = useState('');
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas las contraseñas');
    const [visibles, setVisibles] = useState<{ [key: string]: boolean }>({});

    // === AGREGADO 1: Estado para manejar dinámicamente el listado de contraseñas ===
    const [listaContraseñas, setListaContraseñas] = useState<Credencial[]>(DATOS_MOCK);

    // === AGREGADO 2: Estados para controlar la visibilidad del modal y los datos del formulario ===
    const [modalVisible, setModalVisible] = useState(false);
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [nuevoUsuario, setNuevoUsuario] = useState('');
    const [nuevaClave, setNuevaClave] = useState('');
    const [nuevaCategoria, setNuevaCategoria] = useState('Contraseñas Personales');

    const colorScheme = useColorScheme(); 
    const isDark = colorScheme === 'dark';

    const fondoPantalla = isDark 
      ? require('../assets/images/FondoLima.png') 
      : require('../assets/images/FondoLimaOscuro.png');

    const fondoEncuadre = isDark 
      ? require('../assets/images/FondoLimaOscuro.png') 
      : require('../assets/images/FondoLima.png');

    const colors = {
      textPrimary: isDark ? '#ffffff' : '#000000',
      textSecondary: isDark ? '#ffffff' : '#4b5563',
      searchBg: isDark ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255, 255, 255, 0.85)',
      searchBorder: isDark ? '#333333' : '#ccc',
      searchText: isDark ? '#ffffff' : '#000000',
      cardBg: isDark ? '#ffffff' : '#1e1e1e',
      cardText: isDark ? '#111827' : '#ffffff',
      cardSubtext: isDark ? '#6b7280' : '#a1a1aa',
      claveBg: isDark ? '#f9fafb' : '#2a2a2a',
      claveText: isDark ? '#374151' : '#f3f4f6',
      badgeBg: isDark ? '#f3f4f6' : '#333333',
      badgeText: isDark ? '#4b5563' : '#d1d5db',
    };

    const toggleVisibilidad = (id: string) => {
        setVisibles((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    // === AGREGADO 3: Función para validar y agregar la nueva contraseña ===
    const guardarNuevaContraseña = () => {
        if (!nuevoNombre.trim() || !nuevoUsuario.trim() || !nuevaClave.trim()) {
            Alert.alert('Campos incompletos', 'Por favor completa la aplicación, usuario y contraseña.');
            return;
        }

        const nuevaCredencial: Credencial = {
            id: Date.now().toString(),
            nombre: nuevoNombre,
            usuario: nuevoUsuario,
            clave: nuevaClave,
            categoria: nuevaCategoria,
        };

        // Insertamos el nuevo registro al principio de la lista
        setListaContraseñas([nuevaCredencial, ...listaContraseñas]);

        // Reseteamos el formulario y cerramos el modal
        setNuevoNombre('');
        setNuevoUsuario('');
        setNuevaClave('');
        setNuevaCategoria('Contraseñas Personales');
        setModalVisible(false);
    };

    // Modificado para filtrar sobre listaContraseñas en vez del array estático DATOS_MOCK
    const contraseñasFiltradas = listaContraseñas.filter((item) => {
        const coincideTexto = 
            item.nombre.toLowerCase().includes(texto.toLowerCase()) ||
            item.usuario.toLowerCase().includes(texto.toLowerCase());

        const coincideCategoria = 
            categoriaSeleccionada === 'Todas las contraseñas' || 
            item.categoria === categoriaSeleccionada;

        return coincideTexto && coincideCategoria;
    });

    return (
        <SafeAreaView style={styles.safeArea}>
            <ImageBackground source={fondoPantalla} style={styles.bgImage} resizeMode="cover">
                <ScrollView 
                    style={styles.container} 
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    automaticallyAdjustKeyboardInsets={false}
                >
                    <View style={{ padding: 20 }}>
                        <Text style={[styles.titulo, { color: colors.textPrimary }]}>
                            Contraseñas
                        </Text>
                        <Text style={[styles.textoNormal, { color: colors.textSecondary }]}>
                            Aqui puedes guardar tus contraseñas de forma segura y acceder a ellas cuando lo necesites. Asegúrate de mantener tu información protegida y no compartir tus contraseñas con nadie.
                        </Text>
                    </View>

                    <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
                        <Text style={[styles.titulofuncional, { color: colors.textPrimary }]}>
                            Funcionalidades
                        </Text>
                        <Text style={[styles.textoNormal, { color: colors.textSecondary }]}>
                            - Crear y gestionar contraseñas{"\n"}
                            - Generar contraseñas seguras{"\n"}
                            - Buscar y filtrar contraseñas
                        </Text>
                    </View>

                    {/* === AGREGADO 4: Botón para abrir el formulario modal === */}
                    <View style={{ paddingHorizontal: 20, marginBottom: 15 }}>
                        <Pressable 
                            style={styles.btnAgregar} 
                            onPress={() => setModalVisible(true)}
                        >
                            <Ionicons name="add-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                            <Text style={styles.btnAgregarTexto}>Añadir Nueva Contraseña</Text>
                        </Pressable>
                    </View>

                    <View style={[styles.searchContainer, { backgroundColor: colors.searchBg, borderColor: colors.searchBorder }]}>
                        <Ionicons name="search" size={20} color={isDark ? "#a1a1aa" : "black"} style={styles.icon} />
                        <TextInput
                            style={[styles.input, { color: colors.searchText }]}
                            placeholder="Buscar Contraseña..."
                            placeholderTextColor={isDark ? "#71717a" : "#888"}
                            value={texto}
                            onChangeText={setTexto}
                        />
                    </View>
                    
                    <MenuContraseñas 
                        textoBusqueda={texto} 
                        onSeleccionarCategoria={(cat) => setCategoriaSeleccionada(cat)}
                    />

                    <ImageBackground 
                        source={fondoEncuadre} 
                        style={styles.encuadreContraseñas}
                        imageStyle={styles.encuadreImageRadius}
                        resizeMode="cover"
                    >
                        {contraseñasFiltradas.length === 0 ? (
                            <Text style={[styles.vacioTexto, { color: colors.cardSubtext }]}>
                                No se encontraron contraseñas.
                            </Text>
                        ) : (
                            contraseñasFiltradas.map((item) => {
                                const esVisible = visibles[item.id];

                                return (
                                    <View key={item.id} style={[styles.card, { backgroundColor: colors.cardBg }]}>
                                        <View style={styles.cardHeader}>
                                            <View>
                                                <Text style={[styles.nombreTexto, { color: colors.cardText }]}>
                                                    {item.nombre}
                                                </Text>
                                                <Text style={[styles.usuarioTexto, { color: colors.cardSubtext }]}>
                                                    {item.usuario}
                                                </Text>
                                            </View>
                                            <View style={[styles.badgeCategoria, { backgroundColor: colors.badgeBg }]}>
                                                <Text style={[styles.badgeTexto, { color: colors.badgeText }]}>
                                                    {item.categoria}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={[styles.claveContainer, { backgroundColor: colors.claveBg, borderColor: colors.searchBorder }]}>
                                            <Text style={[styles.claveTexto, { color: colors.claveText }]}>
                                                {esVisible ? item.clave : '••••••••••••'}
                                            </Text>
                                            <Pressable onPress={() => toggleVisibilidad(item.id)} style={styles.ojoBtn}>
                                                <Ionicons 
                                                    name={esVisible ? "eye-off-outline" : "eye-outline"} 
                                                    size={20} 
                                                    color={isDark ? "#6b7280" : "#9ca3af"} 
                                                />
                                            </Pressable>
                                        </View>
                                    </View>
                                );
                            })
                        )}
                    </ImageBackground>

                    {/* === AGREGADO 5: Modal con formulario para los 4 datos requeridos === */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.modalBg}>
                            <View style={[styles.modalCard, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}>
                                <Text style={[styles.modalTitulo, { color: isDark ? '#ffffff' : '#000000' }]}>
                                    Nueva Contraseña
                                </Text>

                                <Text style={styles.label}>Aplicación / Servicio:</Text>
                                <TextInput
                                    style={[styles.modalInput, { color: isDark ? '#fff' : '#000', borderColor: colors.searchBorder }]}
                                    placeholder="Ej: Spotify, Facebook..."
                                    placeholderTextColor="#888"
                                    value={nuevoNombre}
                                    onChangeText={setNuevoNombre}
                                />

                                <Text style={styles.label}>Email / Usuario:</Text>
                                <TextInput
                                    style={[styles.modalInput, { color: isDark ? '#fff' : '#000', borderColor: colors.searchBorder }]}
                                    placeholder="Ej: usuario@gmail.com"
                                    placeholderTextColor="#888"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={nuevoUsuario}
                                    onChangeText={setNuevoUsuario}
                                />

                                <Text style={styles.label}>Contraseña:</Text>
                                <TextInput
                                    style={[styles.modalInput, { color: isDark ? '#fff' : '#000', borderColor: colors.searchBorder }]}
                                    placeholder="••••••••••••"
                                    placeholderTextColor="#888"
                                    secureTextEntry
                                    value={nuevaClave}
                                    onChangeText={setNuevaClave}
                                />

                                <Text style={styles.label}>Categoría:</Text>
                                <View style={styles.opcionesCategorias}>
                                    {['Contraseñas Personales', 'Trabajo y Servidores', 'Redes Sociales'].map((cat) => (
                                        <Pressable
                                            key={cat}
                                            style={[
                                                styles.chipCategoria,
                                                nuevaCategoria === cat && styles.chipCategoriaActivo
                                            ]}
                                            onPress={() => setNuevaCategoria(cat)}
                                        >
                                            <Text style={[
                                                styles.chipTexto,
                                                nuevaCategoria === cat && styles.chipTextoActivo
                                            ]}>
                                                {cat}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>

                                <View style={styles.modalAcciones}>
                                    <Pressable 
                                        style={[styles.btnModal, { backgroundColor: '#e5e7eb' }]} 
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Text style={{ color: '#374151', fontWeight: '600' }}>Cancelar</Text>
                                    </Pressable>

                                    <Pressable 
                                        style={[styles.btnModal, { backgroundColor: '#4f46e5' }]} 
                                        onPress={guardarNuevaContraseña}
                                    >
                                        <Text style={{ color: '#ffffff', fontWeight: '600' }}>Guardar</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </Modal>

                </ScrollView>
            </ImageBackground>
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

  // Estilo para el nuevo botón principal "Añadir Nueva Contraseña"
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
  encuadreContraseñas: {
    padding: 12,
    marginHorizontal: 20,
    marginTop: 15,
    overflow: 'hidden',
  },
  encuadreImageRadius: {
    borderRadius: 12,
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
  },
  ojoBtn: {
    padding: 2,
  },

  // Estilos dedicados al Modal y Formulario
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
    color: '#6b7280',
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
  },
  opcionesCategorias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
    marginBottom: 15,
  },
  chipCategoria: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#9ca3af',
  },
  chipCategoriaActivo: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  chipTexto: {
    fontSize: 12,
    color: '#6b7280',
  },
  chipTextoActivo: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  modalAcciones: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
  },
  btnModal: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
});