import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import Ionicons from '@expo/vector-icons/Ionicons';
import AppPopup, { useAppPopup } from './components/AppPopup';
import ThemeToggle from '../theme/ThemeToggle';
import { useTheme } from '../theme/ThemeProvider';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function LoginScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { popup, showPopup, dismissPopup } = useAppPopup();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [hasStoredCredentials, setHasStoredCredentials] = useState(false);
  const [loadingMethod, setLoadingMethod] = useState<'password' | 'biometric' | null>(null);

  const navegarAInicio = (userId: number | string) => {
    router.replace({ pathname: '/inicio', params: { userId: String(userId) } });
  };

  useEffect(() => {
    // Verificar si el dispositivo soporta biometría y si hay credenciales guardadas
    const checkBiometrics = async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);

      const savedEmail = await SecureStore.getItemAsync('user_email');
      const savedPass = await SecureStore.getItemAsync('user_password');
      if (savedEmail && savedPass) {
        setHasStoredCredentials(true);
      }
    };

    checkBiometrics();
  }, []);

  // Función para ejecutar el login contra el backend
  const ejecutarLoginEnAPI = async (emailLogin: string, passwordLogin: string, guardarParaBiometria: boolean = false) => {
    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: emailLogin.trim(), 
          password: passwordLogin.trim() 
        }),
      });

      if (response.ok) {
        const user = await response.json(); 

        if (guardarParaBiometria) {
          showPopup({
            title: 'Huella Digital',
            message: '¿Deseas activar el inicio de sesión por huella digital para la próxima vez?',
            tone: 'confirm',
            actions: [
              { label: 'No', variant: 'secondary', onPress: () => navegarAInicio(user.id) },
              {
                label: 'Sí, activar',
                variant: 'primary',
                onPress: async () => {
                  try {
                    await SecureStore.setItemAsync('user_email', emailLogin.trim());
                    await SecureStore.setItemAsync('user_password', passwordLogin.trim());
                    setHasStoredCredentials(true);
                    navegarAInicio(user.id);
                  } catch (error) {
                    console.error('Error al guardar credenciales biométricas:', error);
                    showPopup({
                      title: 'Error',
                      message: 'No se pudo guardar el acceso biométrico.',
                      tone: 'error',
                      actions: [{ label: 'Continuar', onPress: () => navegarAInicio(user.id) }],
                    });
                  }
                },
              },
            ],
          });
          return;
        }
        
        navegarAInicio(user.id);
        
      } else {
        showPopup({ title: 'Error', message: 'Credenciales incorrectas.', tone: 'error' });
      }
    } catch (error) {
      console.error("Error en el login:", error);
      showPopup({ title: 'Error de conexión', message: 'No se pudo conectar con el servidor.', tone: 'error' });
    }
  };

  const handleLogin = async () => {
    if (loadingMethod) return;
    if (!email.trim() || !password.trim()) {
      showPopup({ title: 'Error', message: 'Por favor ingresa tu correo electrónico y contraseña.', tone: 'info' });
      return;
    }
    setLoadingMethod('password');
    try {
      await ejecutarLoginEnAPI(email, password, true);
    } finally {
      setLoadingMethod(null);
    }
  };

  // Función para iniciar sesión usando huella digital
  const handleBiometricLogin = async () => {
    if (loadingMethod) return;
    setLoadingMethod('biometric');
    try {
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        showPopup({ title: 'Aviso', message: 'No hay huellas registradas en este dispositivo.', tone: 'info' });
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Ingresa con tu huella digital',
        fallbackLabel: 'Usar contraseña',
      });

      if (result.success) {
        const savedEmail = await SecureStore.getItemAsync('user_email');
        const savedPass = await SecureStore.getItemAsync('user_password');

        if (savedEmail && savedPass) {
          await ejecutarLoginEnAPI(savedEmail, savedPass, false);
        } else {
          showPopup({ title: 'Aviso', message: 'Inicia sesión con correo y contraseña al menos una vez para activar la huella.', tone: 'info' });
        }
      }
    } catch (error) {
      console.error("Error biométrico:", error);
      showPopup({ title: 'Error', message: 'No se pudo completar la autenticación biométrica.', tone: 'error' });
    } finally {
      setLoadingMethod(null);
    }
  };

  return (
    <ImageBackground 
      source={isDarkMode ? require('../assets/images/FondoLimaOscuro.png') : require('../assets/images/FondoLima.png')}
      style={styles.backgroundImage}
    >
      <ThemeToggle style={styles.themeToggle} />
      <View style={[styles.container, { backgroundColor: isDarkMode ? 'rgba(10, 15, 24, 0.48)' : 'rgba(255, 255, 255, 0.12)' }]}>
        <Text style={[styles.title, { color: isDarkMode ? '#f8fafc' : '#17211a' }]}>Proyecto Lima</Text>
        <Text style={[styles.subtitle, { color: isDarkMode ? '#d1d5db' : '#374151' }]}>Inicia sesión en tu bóveda</Text>

        <TextInput 
          style={[styles.input, { backgroundColor: isDarkMode ? '#1f2937' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#111827', borderColor: isDarkMode ? '#475569' : '#ddd' }]}
          placeholder="Correo electrónico" 
          placeholderTextColor={isDarkMode ? '#a8b2c1' : '#888'}
          value={email} 
          onChangeText={setEmail} 
          autoCapitalize="none" 
          keyboardType="email-address"
        />
        <TextInput 
          style={[styles.input, { backgroundColor: isDarkMode ? '#1f2937' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#111827', borderColor: isDarkMode ? '#475569' : '#ddd' }]}
          placeholder="Contraseña principal" 
          placeholderTextColor={isDarkMode ? '#a8b2c1' : '#888'}
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry 
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} disabled={loadingMethod !== null}>
          {loadingMethod === 'password' ? (
            <View style={styles.loadingContent}>
              <ActivityIndicator color="#fff" />
              <Text style={styles.primaryButtonText}>Iniciando sesión...</Text>
            </View>
          ) : (
            <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

        {/* BOTÓN DE HUELLA DIGITAL (Solo aparece si el cel es compatible y ya se guardaron credenciales o hay soporte) */}
        {isBiometricSupported && hasStoredCredentials && (
          <TouchableOpacity style={styles.biometricButton} onPress={handleBiometricLogin} disabled={loadingMethod !== null}>
            {loadingMethod === 'biometric' ? (
              <View style={styles.loadingContent}>
                <ActivityIndicator color="#fff" />
                <Text style={styles.biometricButtonText}>Verificando huella...</Text>
              </View>
            ) : (
              <>
                <Ionicons name="finger-print" size={24} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.biometricButtonText}>Ingresar con Huella Digital</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('../registro')} disabled={loadingMethod !== null}>
          <Text style={styles.secondaryButtonText}>Crear una cuenta nueva</Text>
        </TouchableOpacity>
      </View>
      <AppPopup popup={popup} onDismiss={dismissPopup} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  themeToggle: { position: 'absolute', top: 52, right: 20, zIndex: 2 },
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'transparent' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', color: '#333', marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 40 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd', fontSize: 16 },
  primaryButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  biometricButton: { backgroundColor: '#4f46e5', padding: 15, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  biometricButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  loadingContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  secondaryButton: { padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  secondaryButtonText: { color: '#007bff', fontSize: 16, fontWeight: 'bold' }
});