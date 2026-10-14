import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import Ionicons from '@expo/vector-icons/Ionicons';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [hasStoredCredentials, setHasStoredCredentials] = useState(false);

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
          // Preguntar si desea activar acceso biométrico para futuras ocasiones
          Alert.alert(
            "Huella Digital",
            "¿Deseas activar el inicio de sesión por huella digital para la próxima vez?",
            [
              { text: "No", style: "cancel" },
              { 
                text: "Sí, activar", 
                onPress: async () => {
                  await SecureStore.setItemAsync('user_email', emailLogin.trim());
                  await SecureStore.setItemAsync('user_password', passwordLogin.trim());
                  setHasStoredCredentials(true);
                }
              }
            ]
          );
        }
        
        // Navegamos a inicio y pasamos el userId
        router.replace({
          pathname: '/inicio',
          params: { userId: user.id }
        });
        
      } else {
        Alert.alert("Error", "Credenciales incorrectas.");
      }
    } catch (error) {
      console.error("Error en el login:", error);
      Alert.alert("Error de conexión", "No se pudo conectar con el servidor.");
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Por favor ingresa tu correo electrónico y contraseña.");
      return;
    }
    await ejecutarLoginEnAPI(email, password, true);
  };

  // Función para iniciar sesión usando huella digital
  const handleBiometricLogin = async () => {
    try {
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        Alert.alert("Aviso", "No hay huellas registradas en este dispositivo.");
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
          Alert.alert("Aviso", "Inicia sesión con correo y contraseña al menos una vez para activar la huella.");
        }
      }
    } catch (error) {
      console.error("Error biométrico:", error);
      Alert.alert("Error", "No se pudo completar la autenticación biométrica.");
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