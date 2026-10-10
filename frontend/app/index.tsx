import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor ingresa tu email y contraseña.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const user = await response.json(); 
        
        // Navegamos a inicio y pasamos el userId como parámetro en la memoria de Expo Router
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Proyecto Lima</Text>
      <Text style={styles.subtitle}>Inicia sesión en tu bóveda</Text>

      <TextInput style={styles.input} placeholder="Correo electrónico" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Contraseña principal" value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
        <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('../registro')}>
        <Text style={styles.secondaryButtonText}>Crear una cuenta nueva</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', color: '#333', marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 40 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd', fontSize: 16 },
  primaryButton: { backgroundColor: '#007bff', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  secondaryButton: { padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  secondaryButtonText: { color: '#007bff', fontSize: 16, fontWeight: 'bold' }
});