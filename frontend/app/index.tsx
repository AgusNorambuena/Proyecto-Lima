import React, { useState } from "react";
import { ActivityIndicator, Image, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";

const API_URL = process.env.EXPO_PUBLIC_API_URL
  ?? (Platform.OS === "android" ? "http://10.0.2.2:8080" : "http://localhost:8080");

export default function Index() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@lima.local");
  const [password, setPassword] = useState("LimaAdmin2026!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const iniciarSesion = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!response.ok) {
        throw new Error("Correo o contraseña incorrectos.");
      }

      router.replace("/inicio");
    } catch (requestError) {
      setError(requestError instanceof TypeError
        ? "No se pudo conectar con el servidor. Revisa que el backend esté iniciado."
        : (requestError as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/LogoLima.png")} style={styles.logo} resizeMode="contain" />
      <View style={styles.form}>
        <Text style={styles.title}>Iniciar sesión</Text>
        <Text style={styles.subtitle}>Accede a tu espacio seguro</Text>
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="Correo electrónico"
          placeholderTextColor="#8b9a91"
          style={styles.input}
          value={email}
        />
        <TextInput
          onChangeText={setPassword}
          placeholder="Contraseña"
          placeholderTextColor="#8b9a91"
          secureTextEntry
          style={styles.input}
          value={password}
        />
        {!!error && <Text style={styles.error}>{error}</Text>}
        <Pressable disabled={loading} onPress={iniciarSesion} style={styles.button}>
          {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.buttonText}>Entrar</Text>}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 28, backgroundColor: "#e9f2e5" },
  logo: { width: "100%", height: 150, marginBottom: 8 },
  form: { backgroundColor: "rgba(255,255,255,0.94)", borderRadius: 18, padding: 24, shadowColor: "#1d3526", shadowOpacity: 0.15, shadowRadius: 12, elevation: 4 },
  title: { color: "#183d28", fontSize: 28, fontWeight: "700", marginBottom: 6 },
  subtitle: { color: "#617268", fontSize: 15, marginBottom: 22 },
  input: { borderColor: "#cbd9ce", borderRadius: 10, borderWidth: 1, color: "#183d28", fontSize: 16, marginBottom: 12, paddingHorizontal: 14, paddingVertical: 13 },
  button: { alignItems: "center", backgroundColor: "#52b788", borderRadius: 10, justifyContent: "center", minHeight: 50, marginTop: 8 },
  buttonText: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
  error: { color: "#b42318", fontSize: 14, marginBottom: 4 },
});
