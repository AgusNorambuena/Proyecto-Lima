import React from "react";
import { Slot } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";

export default () => (
    <>
        <ScrollView style={styles.scroll} id="ui-scrollview" contentContainerStyle={styles.scrollContainer}>
            <Slot />
        </ScrollView>
    </>
);

const styles = StyleSheet.create({
    scroll: { flex: 1, height: "100%" },
    scrollContainer: { flexGrow: 1 },
});