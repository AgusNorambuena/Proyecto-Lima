import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

// Tomamos la IP de tu PC configurada en el .env
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validaciones básicas de campos vacíos
    if (!username.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos.');
      return;
    }

    setLoading(true);

    try {
      // Hacemos el POST al endpoint de usuarios de tu backend
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password: password.trim(),
        }),
      });

      if (response.status === 201 || response.ok) {
        Alert.alert(
          '¡Cuenta creada!',
          'Tu usuario ha sido registrado exitosamente. Ya puedes iniciar sesión.',
          [
            {
              text: 'OK',
              onPress: () => router.back(), // Redirige al Login (index.tsx)
            },
          ]
        );
      } else {
        const errorText = await response.text();
        Alert.alert('Error', errorText || 'No se pudo crear la cuenta. Verifica los datos.');
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      Alert.alert(
        'Error de conexión',
        'No se pudo conectar con el servidor. Revisa que Spring Boot esté levantado y conectado a la misma red Wi-Fi.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground 
      source={require('../assets/images/FondoLima.png')} 
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Nueva Cuenta</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

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
          placeholder="Teléfono"
          placeholderTextColor="#888"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="Crea una contraseña maestra"
          placeholderTextColor="#888"
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'transparent' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  primaryButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  secondaryButton: { padding: 15, alignItems: 'center', marginTop: 10 },
  secondaryButtonText: { color: '#007bff', fontSize: 16, fontWeight: 'bold' }
});