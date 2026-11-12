import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import AppPopup, { useAppPopup } from './components/AppPopup';
import ThemeToggle from '../theme/ThemeToggle';
import { useTheme } from '../theme/ThemeProvider';

// Tomamos la IP de tu PC configurada en el .env
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function RegisterScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { popup, showPopup, dismissPopup } = useAppPopup();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validaciones básicas de campos vacíos
    if (!email.trim() || !password.trim()) {
      showPopup({ title: 'Campos incompletos', message: 'Por favor completa todos los campos.', tone: 'info' });
      return;
    }

    setLoading(true);

    try {
      // Hacemos el POST al endpoint de usuarios de tu backend
      const response = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      if (response.status === 201 || response.ok) {
        showPopup({
          title: '¡Cuenta creada!',
          message: 'Tu usuario ha sido registrado exitosamente. Ya puedes iniciar sesión.',
          tone: 'success',
          actions: [{ label: 'OK', onPress: () => router.back() }],
        });
      } else {
        const errorText = await response.text();
        showPopup({ title: 'Error', message: errorText || 'No se pudo crear la cuenta. Verifica los datos.', tone: 'error' });
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      showPopup({
        title: 'Error de conexión',
        message: 'No se pudo conectar con el servidor. Revisa que Spring Boot esté levantado y conectado a la misma red Wi-Fi.',
        tone: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground 
      source={isDarkMode ? require('../assets/images/FondoLimaOscuro.png') : require('../assets/images/FondoLima.png')}
      style={styles.backgroundImage}
    >
      <ThemeToggle style={styles.themeToggle} />
      <View style={[styles.container, { backgroundColor: isDarkMode ? 'rgba(10, 15, 24, 0.48)' : 'rgba(255, 255, 255, 0.12)' }]}>
        <Text style={[styles.title, { color: isDarkMode ? '#f8fafc' : '#17211a' }]}>Nueva Cuenta</Text>

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
          placeholder="Crea una contraseña maestra"
          placeholderTextColor={isDarkMode ? '#a8b2c1' : '#888'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={handleRegister} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>Crear Cuenta</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.secondaryButtonText}>Volver al Login</Text>
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
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  primaryButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  secondaryButton: { padding: 15, alignItems: 'center', marginTop: 10 },
  secondaryButtonText: { color: '#007bff', fontSize: 16, fontWeight: 'bold' }
});