import { StyleSheet, View, Text, Image, Pressable, useWindowDimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const DATA = [
  { id: '1', title: 'Elemento 1' },
  { id: '2', title: 'Elemento 2' },
  { id: '3', title: 'Elemento 3' },
  { id: '4', title: 'Elemento 4' },
];

export default function Inicio() {
    const { width } = useWindowDimensions();
    const styles = Styles(width);
    

    return (
        <View style={styles.Wrapper}>
            <StatusBar style="light" />
            <SafeAreaView style={styles.Body}>
                
                <View style={styles.LogoContainer}>
                    <Image
                        source={require('../../../assets/images/LogoLima.png')}
                        style={styles.Logo}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.Seccion}>
                    <Pressable style={styles.Gestor}>
                        <Text style={styles.gestorTexto}>Contraseñas</Text>
                    </Pressable>

                    <View style={styles.Contenido}>
                        <ScrollView
                            horizontal={true}
                            style={styles.scrollView}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.contenedorScroll}
                        >
                            <View style={styles.card}><Text style={styles.texto}>Elemento 1</Text></View>
                            <View style={styles.card}><Text style={styles.texto}>Elemento 2</Text></View>
                            <View style={styles.card}><Text style={styles.texto}>Elemento 3</Text></View>
                            <View style={styles.card}><Text style={styles.texto}>Elemento 4</Text></View>
                        </ScrollView>
                    </View>

                    <Pressable style={styles.Gestor}>
                        <Text style={styles.gestorTexto}>Contraseñas</Text>
                    </Pressable>

                    <View style={styles.Contenido}>
                        <ScrollView
                            horizontal
                            style={styles.scrollView}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.contenedorScroll}
                        >
                            <View style={styles.card}><Text style={styles.texto}>Elemento 1</Text></View>
                            <View style={styles.card}><Text style={styles.texto}>Elemento 2</Text></View>
                            <View style={styles.card}><Text style={styles.texto}>Elemento 3</Text></View>
                            <View style={styles.card}><Text style={styles.texto}>Elemento 4</Text></View>
                        </ScrollView>
                    </View>

                    <Pressable style={styles.Gestor}>
                        <Text style={styles.gestorTexto}>Contraseñas</Text>
                    </Pressable>

                    <View style={styles.Contenido}>
                        <ScrollView
                            horizontal={true}
                            style={styles.scrollView}
                            showsHorizontalScrollIndicator={true}
                            contentContainerStyle={styles.contenedorScroll}
                        >
                            <View style={styles.card}><Text style={styles.texto}>Elemento 1</Text></View>
                            <View style={styles.card}><Text style={styles.texto}>Elemento 2</Text></View>
                            <View style={styles.card}><Text style={styles.texto}>Elemento 3</Text></View>
                            <View style={styles.card}><Text style={styles.texto}>Elemento 4</Text></View>
                        </ScrollView>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const Styles = (width: number) => StyleSheet.create({
    Wrapper: {
        flex: 1,
    },
    Body: {
        flex: 1,
        backgroundColor: "#e7e7e7",
    },
    LogoContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        marginBottom: 10,
    },
    Logo: {
        width: 200,
        height: 160,
    },
    Seccion: {
        marginBottom: 10,
    },
    Gestor: {
        backgroundColor: "hsl(83, 69%, 48%)",
        borderRadius: 10,
        padding: 10,
        marginLeft: width * 0.1,
        width: width * 0.3,
        marginBottom: 10,
        alignItems: "center",
        justifyContent: "center",
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.3,
        // shadowRadius: 4,
        // elevation: 4,
    },
    gestorTexto: {
        fontSize: 15,
        fontWeight: "bold",
    },
    Contenido: {
        backgroundColor: "#72727265",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        height: width * 0.3,
        width: width * 0.8,
        alignSelf: "center",
        justifyContent: "center",
    },
    scrollView: {
        width: '100%',
    },
    contenedorScroll: {
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    card: {
        width: width * 0.4,
        height: width * 0.2,
        backgroundColor: '#4f46e5',
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    texto: { color: '#fff', fontWeight: 'bold' },
});