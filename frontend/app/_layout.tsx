import React from "react";
import { Slot } from "expo-router";
import { View, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "../theme/ThemeProvider";

export default function RootLayout() {
    return (
        <ThemeProvider>
            <LayoutContent />
        </ThemeProvider>
    );
}

function LayoutContent() {
    const { isDarkMode } = useTheme();
    return (
        <>
            <StatusBar style={isDarkMode ? "light" : "dark"} />
            <View style={styles.container}>
                <ScrollView style={styles.scroll} id="ui-scrollview" contentContainerStyle={styles.scrollContainer}>
                    <Slot />
                </ScrollView>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
    },
    scroll: { flex: 1, height: "100%" },
    scrollContainer: { flexGrow: 1 },
});