import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import Ionicons from '@expo/vector-icons/Ionicons';
import AppPopup, { useAppPopup } from './components/AppPopup';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function LoginScreen() {
  const router = useRouter();
  const { popup, showPopup, dismissPopup } = useAppPopup();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [hasStoredCredentials, setHasStoredCredentials] = useState(false);

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
    if (!email.trim() || !password.trim()) {
      showPopup({ title: 'Error', message: 'Por favor ingresa tu correo electrónico y contraseña.', tone: 'info' });
      return;
    }
    await ejecutarLoginEnAPI(email, password, true);
  };

  // Función para iniciar sesión usando huella digital
  const handleBiometricLogin = async () => {
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
    }
  };

  return (
    <ImageBackground 
      source={require('../assets/images/FondoLima.png')} 
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Proyecto Lima</Text>
        <Text style={styles.subtitle}>Inicia sesión en tu bóveda</Text>

        <TextInput 
          style={styles.input} 
          placeholder="Correo electrónico" 
          placeholderTextColor="#888"
          value={email} 
          onChangeText={setEmail} 
          autoCapitalize="none" 
          keyboardType="email-address"
        />
        <TextInput 
          style={styles.input} 
          placeholder="Contraseña principal" 
          placeholderTextColor="#888"
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry 
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        {/* BOTÓN DE HUELLA DIGITAL (Solo aparece si el cel es compatible y ya se guardaron credenciales o hay soporte) */}
        {isBiometricSupported && hasStoredCredentials && (
          <TouchableOpacity style={styles.biometricButton} onPress={handleBiometricLogin}>
            <Ionicons name="finger-print" size={24} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.biometricButtonText}>Ingresar con Huella Digital</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('../registro')}>
          <Text style={styles.secondaryButtonText}>Crear una cuenta nueva</Text>
        </TouchableOpacity>
      </View>
      <AppPopup popup={popup} onDismiss={dismissPopup} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'transparent' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', color: '#333', marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 40 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd', fontSize: 16 },
  primaryButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  biometricButton: { backgroundColor: '#4f46e5', padding: 15, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  biometricButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  secondaryButton: { padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  secondaryButtonText: { color: '#007bff', fontSize: 16, fontWeight: 'bold' }
});