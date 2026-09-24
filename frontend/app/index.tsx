import React, { useState } from "react";
import { ActivityIndicator, Image, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import Inicio from "./inicio";

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
    <>
    <View>
      <Inicio />

    </View>
    </>
  );
}
