import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  Pressable, 
  useColorScheme,
  ImageBackground // 1. Importamos ImageBackground
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

    const colorScheme = useColorScheme(); 
    const isDark = colorScheme === 'dark';

    // 2. Definimos las imágenes de fondo según el tema
    const fondoPantalla = isDark 
      ? require('../assets/images/FondoLima.png') 
      : require('../assets/images/FondoLimaOscuro.png');

    const fondoEncuadre = isDark 
  
      ? require('../assets/images/FondoLimaOscuro.png')  // Invertido: claro en dark mode
      : require('../assets/images/FondoLima.png'); // Invertido: oscuro en light mode

    // 3. Colores para textos y cajas de entrada
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
    };

    const toggleVisibilidad = (id: string) => {
        setVisibles((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const contraseñasFiltradas = DATOS_MOCK.filter((item) => {
        const coincideTexto = 
            item.nombre.toLowerCase().includes(texto.toLowerCase()) ||
            item.usuario.toLowerCase().includes(texto.toLowerCase());

        const coincideCategoria = 
            categoriaSeleccionada === 'Todas las contraseñas' || 
            item.categoria === categoriaSeleccionada;

        return coincideTexto && coincideCategoria;
    });

console.log("Categoría activa:", categoriaSeleccionada);
console.log("Texto de búsqueda:", texto);
console.log("Resultados filtrados:", contraseñasFiltradas.length);

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* 4. Aplicamos el fondo general a la pantalla */}
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

                    {/* 5. Aplicamos el fondo al encuadre e invertimos según el tema */}
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
});