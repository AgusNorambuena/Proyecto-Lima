import React from "react";
import { Slot, usePathname } from "expo-router";
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function RootLayout() {
    const insets = useSafeAreaInsets();
    const pathname = usePathname();
    const mostrarBarra = pathname !== "/";

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scroll} id="ui-scrollview" contentContainerStyle={styles.scrollContainer}>
                <Slot />
            </ScrollView>

            {/* Barra flotante, fuera del ScrollView, siempre montada y visible */}
            {mostrarBarra && <View style={[styles.barraFlotanteContainer, { bottom: insets.bottom + 15 }]}>
                <Pressable style={styles.botonSecundario} onPress={() => console.log("Izquierda")}>
                    <Ionicons name="person-outline" size={24} color="#fff" />
                </Pressable>

                <Pressable style={styles.botonPrincipal} onPress={() => console.log("Botón Central +")}>
                    <Ionicons name="add" size={32} color="#fff" />
                </Pressable>

                <Pressable style={styles.botonSecundario} onPress={() => console.log("Derecha")}>
                    <Ionicons name="settings-outline" size={24} color="#fff" />
                </Pressable>
            </View>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
    },
    scroll: { flex: 1, height: "100%" },
    scrollContainer: { flexGrow: 1 },
    barraFlotanteContainer: {
        position: "absolute",
        left: 20,
        right: 20,
        height: 70,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: 35,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
        zIndex: 999,
    },
    botonSecundario: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#00b4d8",
        justifyContent: "center",
        alignItems: "center",
    },
    botonPrincipal: {
        width: 65,
        height: 65,
        borderRadius: 32.5,
        backgroundColor: "#52b788",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
        borderWidth: 3,
        borderColor: "#fff",
    },
});